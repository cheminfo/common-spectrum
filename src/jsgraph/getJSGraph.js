import { addStyle } from './addStyle';
import { COLORS } from './colors';
/**
 * Generate a jsgraph chart format from an array of Analysis
 * @param {Array<Analysis>} analyses
 * @param {object} [options={}]
 * @param {Array} [options.ids] List of spectra ids, by all
 * @param {Array} [options.colors] List of colors
 * @param {object} [options.selector={}]
 * @param {object} [options.normalization]
 */
export function getJSGraph(analyses, options = {}) {
  const { colors = COLORS, selector, normalization } = options;
  let series = [];

  let xLabel = '';
  let yLabel = '';

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    let serie = {};
    let currentData = analysis.getNormalizedData({
      selector,
      normalization,
    });
    if (!currentData) continue;
    if (!xLabel) xLabel = analysis.getXLabel(selector);
    if (!yLabel) yLabel = analysis.getYLabel(selector);
    addStyle(serie, analysis, { color: colors[i] });
    serie.data = currentData;
    series.push(serie);
  }
  return {
    axes: {
      x: {
        label: xLabel,
        unit: '',
        unitWrapperBefore: '',
        unitWrapperAfter: '',
        flipped: false,
        display: true,
      },
      y: {
        label: yLabel,
        unit: '',
        unitWrapperBefore: '',
        unitWrapperAfter: '',
        flipped: false,
        display: true,
      },
    },
    series,
  };
}
