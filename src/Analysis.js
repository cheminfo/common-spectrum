import { getNormalized } from './util/getNormalized';

/**
 * Class allowing to store and manipulate an analysis.
 * An analysis may contain one or more spectra that are identified
 * by a 'flavor'
 * @class Analysis
 * @param {object} [options={}]
 * @param {string} [options.id=randomString] unique identifier
 * @param {string} [options.label=options.id] human redeable label
 * @param {string} [options.defaultFlavor=''] human redeable label
 */
export class Analysis {
  constructor(options = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 10);
    this.label = options.label || this.id;
    this.spectra = {};
    this.defaultFlavor =
      options.defaultFlavor === undefined ? '' : options.defaultFlavor;
  }

  /**
   * Set a spectrum for a specific flavor
   * @param {DataXY} data
   * @param {object} [options={}]
   * @param {string} [options.defaultFlavor=this.defaultFlavor]
   * @param {string} [options.xLabel='']
   * @param {string} [options.yLabel='']
   * @param {string} [options.title='']
   * @param {object} [options.meta={}]
   *
   */
  set(data, options = {}) {
    const { flavor = this.defaultFlavor } = options;
    this.spectra[flavor.toLowerCase()] = standardizeData(data, options);
  }

  /**
   * Retrieve a Spectrum based on a flavor
   * @param {object} [options={}]
   * @param {string} [options.defaultFlavor=this.defaultFlavor]
   * @returns {Spectrum}
   */
  get(flavor = this.defaultFlavor) {
    flavor = flavor.toLowerCase();

    if (!this.spectra[flavor]) {
      return undefined;
    }
    return this.spectra[flavor];
  }

  /**
   * Return the data object for a specific flavor with possibly some
   * normalization options
   * @param {object} [options={}]
   */
  getData(options = {}) {
    const { flavor, normalization } = options;
    let data = this.get(flavor);
    if (!data) return undefined;
    return getNormalized(data, normalization);
  }

  getXLabel(flavor) {
    return this.get(flavor).xLabel;
  }

  getYLabel(flavor) {
    return this.get(flavor).yLabel;
  }
}

/**
 * Internal function that ensure the order of x / y array
 * @param {DataXY} [data]
 * @param {object} [options={}]
 * @return {Spectrum}
 */
function standardizeData(data, options = {}) {
  const { meta = {}, xLabel = '', yLabel = '', title = '' } = options;
  let { x, y } = data;
  if (x && x.length > 1 && x[0] > x[x.length - 1]) {
    x = x.reverse();
    y = y.reverse();
  } else {
    x = x || [];
    y = y || [];
  }
  data = { x, y };

  return {
    x: data.x,
    y: data.y,
    xLabel,
    yLabel,
    title,
    meta,
  };
}
