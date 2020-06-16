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
   * @param {DataXY} data
   * @param {object} [options={}]
   * @param {string} [options.xLabel='x']
   * @param {string} [options.yLabel='y']
   * @param {string} [options.xUnits='x']
   * @param {string} [options.yUnits='y']
   * @param {string} [options.dataType='']
   * @param {string} [options.title='']
   * @param {object} [options.flavor={}]
   *
   */
  pushSpectrum(data, options = {}) {
    this.spectra.push(standardizeData(data, options));
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
    return this.getSpectrum(selector).xLabel;
  }

  getYLabel(selector) {
    return this.getSpectrum(selector).yLabel;
  }
}

/**
 * Internal function that ensure the order of x / y array
 * @param {DataXY} [data]
 * @param {object} [options={}]
 * @return {Spectrum}
 */
function standardizeData(data, options = {}) {
  let {
    meta = {},
    xLabel = 'x',
    yLabel = 'y',
    xUnits = '',
    yUnits = '',
    dataType = '',
    title = '',
  } = options;

  xUnits = xUnits || xLabel.replace(/^.*[([](.*)[)\]].*$/, '$1');
  yUnits = yUnits || yLabel.replace(/^.*[([](.*)[)\]].*$/, '$1');

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
    xUnits,
    yUnits,
    title,
    dataType,
    meta,
    flavor: `${yUnits} vs ${xUnits}`,
  };
}
