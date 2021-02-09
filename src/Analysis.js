import isAnyArray from 'is-any-array';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import { getNormalizedSpectrum } from './util/getNormalizedSpectrum';
import { getXYSpectrum } from './util/getXYSpectrum';
import { peakPicking } from './util/peakPicking';

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
   * Pick the peaks in a spectrum
   * @param {object} [options={}]
   * @param {object} [options.gsd={}] options for global spectra deconvolution
   * @param {object} [options.gsd.shape={}] - Object that specified the kind of shape to calculate the FWHM instead of width between inflection points. see https://mljs.github.io/peak-shape-generator/#inflectionpointswidthtofwhm
   * @param {object} [options.gsd,shape.kind='gaussian']
   * @param {object} [options.gsd.shape.options={}]
   * @param {object} [options.gsd.sgOptions] - Options object for Savitzky-Golay filter. See https://github.com/mljs/savitzky-golay-generalized#options
   * @param {number} [options.gsd.sgOptions.windowSize = 9] - points to use in the approximations
   * @param {number} [options.gsd.sgOptions.polynomial = 3] - degree of the polynomial to use in the approximations
   * @param {number} [options.gsd.minMaxRatio = 0.00025] - Threshold to determine if a given peak should be considered as a noise
   * @param {number} [options.gsd.broadRatio = 0.00] - If `broadRatio` is higher than 0, then all the peaks which second derivative
   * smaller than `broadRatio * maxAbsSecondDerivative` will be marked with the soft mask equal to true.
   * @param {number} [options.gsd.noiseLevel = 0] - Noise threshold in spectrum units
   * @param {boolean} [options.gsd.maxCriteria = true] - Peaks are local maximum(true) or minimum(false)
   * @param {boolean} [options.gsd.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables
   * @param {boolean} [options.gas.realTopDetection = false] - Use a quadratic optimizations with the peak and its 3 closest neighbors
   * to determine the true x,y values of the peak?
   * @param {number} [options.gsd.heightFactor = 0] - Factor to multiply the calculated height (usually 2)
   * @param {number} [options.gsd.derivativeThreshold = -1] - Filters based on the amplitude of the first derivative
   * @param {object} [options.selector={}]
   * @param {string} [options.selector.units] Units separated by vs like for example "g vs °C"
   * @param {string} [options.selector.xUnits] if undefined takes the first variable
   * @param {string} [options.selector.yUnits] if undefined takes the second variable
   * @returns {Spectrum}
   */
  getPeaks(options = {}) {
    const { selector, gsd } = options;
    return peakPicking(this.getXY(selector), gsd);
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
