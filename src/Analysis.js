import isAnyArray from 'is-any-array';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import { getNormalizedData } from './util/getNormalizedData';
/**
 * Class allowing to store and manipulate an analysis.
 * An analysis may contain one or more spectra that are identified
 * by a 'flavor'
 * @class Analysis
 * @param {object} [options={}]
 * @param {string} [options.id=randomString] unique identifier
 * @param {string} [options.label=options.id] human redeable label
 */
export class Analysis {
  constructor(options = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 10);
    this.label = options.label || this.id;
    this.spectra = [];
  }

  /**
   * Set a spectrum for a specific flavor
   * @param {object} [variables]
   * @param {object} [variables.x]
   * @param {array} [variables.x.data]
   * @param {array} [variables.x.units='x']
   * @param {array} [variables.x.label='x']
   * @param {object} [variables.y]
   * @param {array} [variables.y.data]
   * @param {array} [variables.y.units='y']
   * @param {array} [variables.y.label='y']
   * @param {object} [options={}]
   * @param {string} [options.dataType='']
   * @param {string} [options.title='']
   * @param {object} [options.flavor={}]
   *
   */
  pushSpectrum(variables, options = {}) {
    this.spectra.push(standardizeData(variables, options));
  }

  /**
   * Retrieve a Spectrum based on a flavor
   * @param {object} [selector={}]
   * @param {string} [selector.index]
   * @param {string} [selector.flavor]
   * @returns {Spectrum}
   */
  getSpectrum(selector = {}) {
    let spectra = this.getSpectra(selector);
    return spectra ? spectra[0] : undefined;
  }

  /**
   * Retrieve a Spectrum based on a flavor
   * @param {object} [selector={}]
   * @param {string} [selector.index]
   * @param {string} [selector.flavor]
   * @returns {Spectrum}
   */
  getSpectra(selector = {}) {
    const { index, flavor } = selector;
    if (index !== undefined) {
      return this.spectra[index] ? [this.spectra[index]] : undefined;
    }
    if (flavor === undefined || flavor === '') return this.spectra;
    return this.spectra.filter((spectrum) => spectrum.flavor === flavor);
  }

  /**
   * Return the data object for a specific flavor with possibly some
   * normalization options
   * @param {object} [options={}]
   * @param {object} [options.selector]
   * @param {string} [options.selector.index]
   * @param {string} [options.selector.flavor]
   * @param {object} [options.normalization]
   *
   */
  getNormalizedData(options = {}) {
    const { normalization, selector } = options;
    const spectrum = this.getSpectrum(selector);
    if (!spectrum) return undefined;
    return getNormalizedData(spectrum, normalization);
  }

  getXLabel(selector) {
    return this.getSpectrum(selector).variables.x.label;
  }

  getYLabel(selector) {
    return this.getSpectrum(selector).variables.y.label;
  }
}

/**
 * Internal function that ensure the order of x / y array
 * @param {DataXY} [variables]
 * @param {object} [options={}]
 * @return {Spectrum}
 */
function standardizeData(variables, options = {}) {
  let { meta = {}, dataType = '', title = '' } = options;

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
    flavor: `${yVariable.units} vs ${xVariable.units}`,
  };
}
