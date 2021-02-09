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

import { getJSGraph } from './jsgraph/getJSGraph';
import { getNormalizationAnnotations } from './jsgraph/getNormalizationAnnotations';
import { getTrackAnnotations } from './jsgraph/getTrackAnnotations';
import { getReactPlotJSON } from './reactPlot/getReactPlotJSON';

export * from './AnalysesManager';
export * from './Analysis';
export * from './from/fromJcamp';
export * from './to/toJcamp';
export * from './to/toJcamps';
export * from './util/getNormalizedSpectrum';

export const JSGraph = {
  getJSGraph,
  getReactPlotJSON,
  getNormalizationAnnotations,
  getTrackAnnotations,
};
