/**
 * @typedef {Object} DataXY
 * @property {Array<Number>} x Array of x values
 * @property {Array<Number>} y Array of y values
 */

/**
 * @typedef {Object} Spectrum
 * @property {Array<Number>} x Array of x values
 * @property {Array<Number>} y Array of y values
 * @property {string} xLabel
 * @property {string} yLabel
 * @property {string} title
 * @property {object} meta
 */

import { AnalysesManager } from './AnalysesManager';
import { Analysis } from './Analysis';
import { fromJcamp } from './from/fromJcamp';
import { getJSGraph } from './jsgraph/getJSGraph';
import { toJcamp } from './to/toJcamp';
import { getNormalized } from './util/getNormalized';

export function CommonSpectrum(options = {}) {
  const { dataType = '', defaultFlavor = '' } = options;

  class CustomAnalysis extends Analysis {
    constructor(analysisOptions) {
      super(analysisOptions);
      this.defaultFlavor = defaultFlavor;
    }
  }

  return {
    Analysis: CustomAnalysis,
    AnalysesManager,
    getNormalized,
    fromJcamp: (jcamp, fromOptions) =>
      fromJcamp(jcamp, { defaultFlavor, ...fromOptions }),
    toJcamp: (spectrum) => toJcamp(spectrum, { dataType }),
    getJSGraph: (analyses, jsGraphOptions) =>
      getJSGraph(analyses, { defaultFlavor, ...jsGraphOptions }),
  };
}
