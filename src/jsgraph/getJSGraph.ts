import { addStyle } from './addStyle';
import { COLORS } from './colors';
/**
 * Generate a jsgraph chart format from an array of Analysis
 * @param {Array<Analysis>} analyses
 * @param {object} [options={}]
 * @param {Array} [options.ids] List of spectra ids, by all
 * @param {Array} [options.colors] List of colors
 * @param {Array} [options.opacities=[1]] List of opacities
 * @param {Array} [options.linesWidth=[1]] List of linesWidth
 * @param {object} [options.selector={}]
 * @param {object} [options.normalization]
 */
export function getJSGraph(analyses, options = {}) {
  const {
    colors = COLORS,
    opacities = [1],
    linesWidth = [1],
    selector,
    normalization,
  } = options;
  let series = [];

  let xLabel = '';
  let yLabel = '';

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    let serie = {};
    let currentData = analysis.getNormalizedSpectrum({
      selector,
      normalization,
    });
    if (!currentData) continue;
    if (!xLabel) xLabel = currentData.variables.x.label;
    if (!yLabel) yLabel = currentData.variables.y.label;
    addStyle(serie, analysis, {
      color: colors[i % colors.length],
      opacity: opacities[i % opacities.length],
      lineWidth: linesWidth[i % linesWidth.length],
    });
    serie.data = {
      x: currentData.variables.x.data,
      y: currentData.variables.y.data,
    };
    series.push(serie);
  }
  return {
    axes: {
      x: {
        label: xLabel,
        unit: '',
        flipped: false,
        display: true,
      },
      y: {
        label: yLabel,
        unit: '',
        flipped: false,
        display: true,
      },
    },
    series,
  };
}
