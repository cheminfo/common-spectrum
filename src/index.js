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
import { getNormalizationAnnotations } from './jsgraph/getNormalizationAnnotations';
import { toJcamp } from './to/toJcamp';
import { toJcamps } from './to/toJcamps';
import { getNormalizedSpectrum } from './util/getNormalizedSpectrum';

export {
  Analysis,
  AnalysesManager,
  getNormalizedSpectrum,
  fromJcamp,
  toJcamp,
  toJcamps,
  getJSGraph,
  getNormalizationAnnotations,
};
