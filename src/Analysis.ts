import type { MeasurementXYVariables, MeasurementXY } from 'cheminfo-types';
import isAnyArray from 'is-any-array';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import { NormalizedSpectrumOptions } from './types/NormalizedSpectrumOptions';
import { SpectrumSelector } from './types/SpectrumSelector';
import { getNormalizedSpectrum } from './util/getNormalizedSpectrum';
import { getXYSpectrum } from './util/getXYSpectrum';

type SpectrumCallback = (
  variables: MeasurementXYVariables,
) => MeasurementXYVariables;

interface AnalysisOptions {
  id?: string;
  label?: string;
  spectrumCallback?: SpectrumCallback;
}
interface NormalizedOptions {
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
  public spectra: Array<MeasurementXY>;
  public cache: Record<string, MeasurementXY | undefined>;

  public constructor(options: AnalysisOptions = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 10);
    this.label = options.label || this.id;
    this.spectrumCallback = options.spectrumCallback;
    this.spectra = [];
    this.cache = {};
  }

  /**
   * Add a spectrum in the internal spectra variable
   */
  public pushSpectrum(
    variables: MeasurementXYVariables,
    options: Omit<MeasurementXY, 'variables'> = {},
  ) {
    this.spectra.push(
      standardizeData(variables, options, {
        spectrumCallback: this.spectrumCallback,
      }),
    );
    this.cache = {};
  }

  /**
   * Retrieve a MeasurementXY based on x/y units
   */
  public getXYSpectrum(selector: SpectrumSelector = {}) {
    let id = JSON.stringify(selector);
    if (!this.cache[id]) {
      this.cache[id] = getXYSpectrum(this.spectra, selector);
    }
    return this.cache[id];
  }

  /**
   * Retrieve a xy object
   * @param selector.units Units separated by vs like for example "g vs °C"
   * @param selector.xUnits if undefined takes the first variable
   * @param selector.yUnits if undefined takes the second variable
   */
  public getXY(selector: SpectrumSelector = {}) {
    let spectrum = this.getXYSpectrum(selector);
    if (!spectrum) return undefined;
    return {
      x: spectrum.variables.x.data,
      y: spectrum.variables.y.data,
    };
  }

  /**
   * Return the data object for specific x/y units with possibly some
   * normalization options
   * @param options.selector.xUnits // if undefined takes the first variable
   * @param options.selector.yUnits // if undefined takes the second variable
   */
  public getNormalizedSpectrum(options: NormalizedOptions = {}) {
    const { normalization, selector } = options;
    const spectrum = this.getXYSpectrum(selector);
    if (!spectrum) return undefined;
    return getNormalizedSpectrum(spectrum, normalization);
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
   * @param selector.xUnits // if undefined takes the first variable
   * @param selector.yUnits // if undefined takes the second variable
   */
  public getXLabel(selector: SpectrumSelector) {
    return this.getXYSpectrum(selector)?.variables.x.label;
  }

  /**
   * Returns the yLabel
   * @param selector.xUnits // if undefined takes the first variable
   * @param selector.yUnits // if undefined takes the second variable
   */
  public getYLabel(selector: SpectrumSelector) {
    return this.getXYSpectrum(selector)?.variables.y.label;
  }
}

/**
 * Internal function that ensure the order of x / y array
 */
function standardizeData(
  variables: MeasurementXYVariables,
  options: Omit<MeasurementXY, 'variables'>,
  analysisOptions: Pick<AnalysisOptions, 'spectrumCallback'>,
) {
  let { meta = {}, dataType = '', description = '' } = options;
  const { spectrumCallback } = analysisOptions;

  if (spectrumCallback) {
    spectrumCallback(variables);
  }

  let xVariable = variables.x;
  let yVariable = variables.y;
  if (!xVariable || !yVariable) {
    throw Error('A spectrum must contain at least x and y variables');
  }
  if (!isAnyArray(xVariable.data) || !isAnyArray(yVariable.data)) {
    throw Error('x and y variables must contain an array data');
  }

  let x = xVariable.data;
  let reverse = x && x.length > 1 && x[0] > x[x.length - 1];

  for (let [key, variable] of Object.entries(variables)) {
    if (reverse) variable.data = variable.data.reverse();
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
    variable.min = min(variable.data);
    variable.max = max(variable.data);
    variable.isMonotone = xIsMonotone(variable.data);
  }

  return {
    variables,
    description,
    dataType,
    meta,
  };
}
