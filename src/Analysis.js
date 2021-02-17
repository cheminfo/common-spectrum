import isAnyArray from 'is-any-array';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import { getNormalizedSpectrum } from './util/getNormalizedSpectrum';
import { getXYSpectrum } from './util/getXYSpectrum';

/**
 * Class allowing to store and manipulate an analysis.
 * An analysis may contain one or more spectra that can be selected
 * based on their units
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
    this.cache = {};
  }

  /**
   * Add a spectrum in the internal spectra variable
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
   * @param {string} [options.meta={}]
   * @param {string} [options.tmp={}] Any temporary data
   */
  pushSpectrum(variables, options = {}) {
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
  getXYSpectrum(selector = {}) {
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
  getXY(selector = {}) {
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
  getNormalizedSpectrum(options = {}) {
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
  getXLabel(selector) {
    return this.getXYSpectrum(selector).variables.x.label;
  }

  /**
   * Returns the yLabel
   * @param {object} [selector]
   * @param {string} [selector.xUnits] // if undefined takes the first variable
   * @param {string} [selector.yUnits] // if undefined takes the second variable
   * @returns {string}
   */
  getYLabel(selector) {
    return this.getXYSpectrum(selector).variables.y.label;
  }
}

/**
 * Internal function that ensure the order of x / y array
 * @param {DataXY} [variables]
 * @param {object} [options={}]
 * @param {string} [options.dataType='']
 * @param {string} [options.title='']
 * @param {string} [options.meta={}]
 * @param {string} [options.tmp={}] Any temporary data
 * @return {Spectrum}
 */
function standardizeData(variables, options = {}) {
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
