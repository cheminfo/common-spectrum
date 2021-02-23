import isAnyArray from 'is-any-array';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import type { SelectorType, SpectrumType, VariableType } from './types';
import { getNormalizedSpectrum } from './util/getNormalizedSpectrum';
import { getXYSpectrum } from './util/getXYSpectrum';

interface AnalysisOptions {
  id?: string;
  label?: string;
}
interface NormalizedOptions {
  normalization?: any;
  selector?: SelectorType;
}

/**
 * Class allowing to store and manipulate an analysis.
 * An analysis may contain one or more spectra that can be selected
 * based on their units
 */
export class Analysis {
  public id: string;
  public label: string;
  public spectra: Array<SpectrumType>;
  public cache: Record<string, SpectrumType | undefined>;

  public constructor(options: AnalysisOptions = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 10);
    this.label = options.label || this.id;
    this.spectra = [];
    this.cache = {};
  }

  /**
   * Add a spectrum in the internal spectra variable
   */
  public pushSpectrum(
    variables: Record<string, VariableType>,
    options: Omit<SpectrumType, 'variables'> = {},
  ) {
    this.spectra.push(standardizeData(variables, options));
    this.cache = {};
  }

  /**
   * Retrieve a Spectrum based on x/y units
   * @param {object} [selector={}]
   * @param {string} [selector.units] Units separated by vs like for example "g vs °C"
   * @param {string} [selector.xUnits] if undefined takes the first variable
   * @param {string} [selector.yUnits] if undefined takes the second variable
   * @returns {Spectrum}
   */
  public getXYSpectrum(selector: SelectorType = {}) {
    let id = JSON.stringify(selector);
    if (!this.cache[id]) {
      this.cache[id] = getXYSpectrum(this.spectra, selector);
    }
    return this.cache[id];
  }

  /**
   * Retrieve a xy object
   * @param {object} [selector={}]
   * @param {string} [selector.units] Units separated by vs like for example "g vs °C"
   * @param {string} [selector.xUnits] if undefined takes the first variable
   * @param {string} [selector.yUnits] if undefined takes the second variable
   * @returns {Spectrum}
   */
  public getXY(selector = {}) {
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
   * @param {object} [options={}]
   * @param {object} [options.selector]
   * @param {string} [options.selector.xUnits] // if undefined takes the first variable
   * @param {string} [options.selector.yUnits] // if undefined takes the second variable
   * @param {object} [options.normalization]
   *
   */
  public getNormalizedSpectrum(options: NormalizedOptions = {}) {
    const { normalization, selector } = options;
    const spectrum = this.getXYSpectrum(selector);
    if (!spectrum) return undefined;
    return getNormalizedSpectrum(spectrum, normalization);
  }

  /**
   * Returns the xLabel
   * @param {object} [selector]
   * @param {string} [selector.xUnits] // if undefined takes the first variable
   * @param {string} [selector.yUnits] // if undefined takes the second variable
   * @returns {string}
   */
  public getXLabel(selector: SelectorType) {
    return this.getXYSpectrum(selector)?.variables.x.label;
  }

  /**
   * Returns the yLabel
   * @param {object} [selector]
   * @param {string} [selector.xUnits] // if undefined takes the first variable
   * @param {string} [selector.yUnits] // if undefined takes the second variable
   * @returns {string}
   */
  public getYLabel(selector: SelectorType) {
    return this.getXYSpectrum(selector)?.variables.y.label;
  }
}

/**
 * Internal function that ensure the order of x / y array
 */
function standardizeData(
  variables: Record<string, VariableType>,
  options: Omit<SpectrumType, 'variables'> = {},
) {
  let { meta = {}, tmp = {}, dataType = '', title = '' } = options;

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

  for (let key in variables) {
    let variable = variables[key];
    if (reverse) variable.data = variable.data.reverse();
    variable.label = variable.label || key;
    variable.units =
      variable.units || variable.label.replace(/^.*[([](.*)[)\]].*$/, '$1');
    variable.min = min(variable.data);
    variable.max = max(variable.data);
    variable.isMonotone = xIsMonotone(variable.data);
  }

  return {
    variables,
    title,
    dataType,
    meta,
    tmp,
  };
}
