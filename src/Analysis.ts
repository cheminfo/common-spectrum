import type { MeasurementVariable, MeasurementXY } from 'cheminfo-types';
import { isAnyArray } from 'is-any-array';
import {
  stringify,
  xIsMonotonic,
  xMaxValue,
  xMinValue,
} from 'ml-spectra-processing';

import type { NormalizedSpectrumOptions } from './types/NormalizedSpectrumOptions';
import type { SpectrumSelector } from './types/SpectrumSelector';
import { getNormalizedSpectrum } from './util/getNormalizedSpectrum';
import { getXYSpectra } from './util/getXYSpectra';
import { getXYSpectrum } from './util/getXYSpectrum';

type SpectrumCallback = (variables: MeasurementVariable) => MeasurementVariable;

interface AnalysisOptions {
  id?: string;
  label?: string;
  spectrumCallback?: SpectrumCallback;
}
export interface NormalizedOptions {
  normalization?: NormalizedSpectrumOptions;
  selector?: SpectrumSelector;
}

/**
 * Class allowing to store and manipulate an analysis.
 * An analysis may contain one or more spectra that can be selected
 * based on their units
 */
export class Analysis {
  public id: string;
  public label: string;
  public spectrumCallback: SpectrumCallback | undefined;
  public spectra: MeasurementXY[];
  private cache: {
    spectrum: Record<string, MeasurementXY | undefined>;
    spectra: Record<string, MeasurementXY[]>;
  };

  public constructor(options: AnalysisOptions = {}) {
    this.id = options.id || Math.random().toString(36).slice(2, 10);
    this.label = options.label || this.id;
    this.spectrumCallback = options.spectrumCallback;
    this.spectra = [];
    this.cache = { spectrum: {}, spectra: {} };
  }

  public clone({ filter = {} }: { filter: { ids?: string[] } }) {
    const { ids } = filter;
    const analysis = new Analysis();
    analysis.id = this.id;
    analysis.label = this.label;
    analysis.spectrumCallback = this.spectrumCallback;
    analysis.spectra = this.spectra.filter((spectrum) => {
      //@ts-expect-error spectrum.id is not expected to be undefined at this level
      return !ids || ids.includes(spectrum.id);
    });
    return analysis;
  }

  public toJSON() {
    // TODO this is likely not the most optimized way to remove typedArray
    // if data are small seems still reasonable
    return {
      id: this.id,
      label: this.label,
      spectra: JSON.parse(stringify(this.spectra)),
    };
  }

  public static fromJSON(json: any) {
    const analysis = new Analysis();
    analysis.id = json.id;
    analysis.label = json.label;
    analysis.spectra = json.spectra;
    return analysis;
  }

  /**
   * Add a spectrum in the internal spectra variable
   * @param variables
   * @param options
   */
  public pushSpectrum(
    variables: MeasurementVariable,
    options: Omit<MeasurementXY, 'variables'> = {},
  ) {
    this.spectra.push(
      standardizeData(variables, options, {
        spectrumCallback: this.spectrumCallback,
      }),
    );
    this.cache = { spectrum: {}, spectra: {} };
  }

  /**
   * Retrieve a MeasurementXY based on x/y units
   * @param selector
   */
  public getXYSpectrum(selector: SpectrumSelector = {}) {
    const id = JSON.stringify(selector);
    if (!this.cache.spectrum[id]) {
      this.cache.spectrum[id] = getXYSpectrum(this.spectra, selector);
    }
    return this.cache.spectrum[id];
  }

  /**
   * Retrieve spectra matching selector
   * @param selector
   */
  public getXYSpectra(selector: SpectrumSelector = {}) {
    const id = JSON.stringify(selector);
    if (!this.cache.spectra[id]) {
      this.cache.spectra[id] = getXYSpectra(this.spectra, selector);
    }
    return this.cache.spectra[id];
  }

  /**
   * Retrieve a xy object
   * @param selector.units - Units separated by vs like for example "g vs °C"
   * @param selector.xUnits - if undefined takes the first variable
   * @param selector.yUnits - if undefined takes the second variable
   * @param selector
   */
  public getXY(selector: SpectrumSelector = {}) {
    const spectrum = this.getXYSpectrum(selector);
    if (!spectrum) return undefined;
    return {
      x: spectrum.variables.x.data,
      y: spectrum.variables.y.data,
    };
  }

  /**
   * Return the data object for specific x/y units with possibly some
   * normalization options
   * @param options.selector.xUnits - // if undefined takes the first variable
   * @param options.selector.yUnits - // if undefined takes the second variable
   * @param options
   */
  public getNormalizedSpectrum(options: NormalizedOptions = {}) {
    const { normalization, selector } = options;
    const spectrum = this.getXYSpectrum(selector);
    if (!spectrum) return undefined;
    return getNormalizedSpectrum(spectrum, normalization);
  }

  /**
   * @param options
   */
  public getNormalizedSpectra(
    options: NormalizedOptions = {},
  ): MeasurementXY[] {
    const { normalization, selector } = options;
    const spectra = this.getXYSpectra(selector);
    if (spectra.length === 0) return [];
    const normalizedSpectra = [];
    for (const spectrum of spectra) {
      normalizedSpectra.push(getNormalizedSpectrum(spectrum, normalization));
    }
    return normalizedSpectra;
  }

  /**
   * Returns the first spectrum. This method could be improved in the future
   * @returns
   */
  public getSpectrum() {
    return this.spectra[0];
  }

  /**
   * Returns the xLabel
   * @param selector.xUnits - // if undefined takes the first variable
   * @param selector.yUnits - // if undefined takes the second variable
   * @param selector
   */
  public getXLabel(selector: SpectrumSelector) {
    return this.getXYSpectrum(selector)?.variables.x.label;
  }

  /**
   * Returns the yLabel
   * @param selector.xUnits - // if undefined takes the first variable
   * @param selector.yUnits - // if undefined takes the second variable
   * @param selector
   */
  public getYLabel(selector: SpectrumSelector) {
    return this.getXYSpectrum(selector)?.variables.y.label;
  }
}

/**
 * Internal function that ensure the order of x / y array
 * @param variables
 * @param options
 * @param analysisOptions
 */
function standardizeData(
  variables: MeasurementVariable,
  options: Omit<MeasurementXY, 'variables'>,
  analysisOptions: Pick<AnalysisOptions, 'spectrumCallback'>,
) {
  const {
    meta = {},
    dataType = '',
    title = '',
    id = Math.random().toString(36).replace('0.', ''),
  } = options;
  const { spectrumCallback } = analysisOptions;

  if (spectrumCallback) {
    spectrumCallback(variables);
  }

  const xVariable = variables.x;
  const yVariable = variables.y;
  if (!xVariable || !yVariable) {
    throw new Error('A spectrum must contain at least x and y variables');
  }
  if (!isAnyArray(xVariable.data) || !isAnyArray(yVariable.data)) {
    throw new Error('x and y variables must contain an array data');
  }

  const x = xVariable.data;
  const reverse = x && x.length > 1 && x[0] > (x.at(-1) as number);

  for (const [key, variable] of Object.entries(variables)) {
    if (reverse) variable.data = variable.data.slice().reverse();
    variable.label = variable.label || key;
    if (variable.label.match(/^.*[([](?<units>.*)[)\]].*$/)) {
      const units = variable.label.replace(
        /^.*[([](?<units>.*)[)\]].*$/,
        '$<units>',
      );
      if (!variable.units || variable.units === units) {
        variable.units = units;
        variable.label = variable.label.replace(/[([].*[)\]]/, '').trim();
      }
    }
    variable.min = xMinValue(variable.data);
    variable.max = xMaxValue(variable.data);
    variable.isMonotonic = xIsMonotonic(variable.data) !== 0;
  }

  return {
    variables,
    title,
    dataType,
    meta,
    id,
  };
}
