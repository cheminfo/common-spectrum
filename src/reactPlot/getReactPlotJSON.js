/**
 * Generate a jsgraph chart format from an array of Analysis
 * @param {Array<Analysis>} analyses
 * @param {object} selector
 */
export function getReactPlotJSON(analyses, selector) {
  let series = [];

  let xLabel = '';
  let yLabel = '';
  let xUnits = '';
  let yUnits = '';

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    const spectra = analysis.getXYSpectrum(selector);
    if (!spectra) continue;
    if (!xLabel) xLabel = spectra.variables.x.label;
    if (!yLabel) yLabel = spectra.variables.y.label;
    if (!xUnits) xUnits = spectra.variables.x.units;
    if (!yUnits) yUnits = spectra.variables.y.units;

    const serie = {
      x: spectra.variables.x.data,
      y: spectra.variables.y.data,
      label: spectra.title,
    };
    series.push(serie);
  }
  return {
    axes: {
      x: { label: `${xLabel} [${xUnits}]` },
      y: { label: `${yLabel} [${yUnits}]` },
    },
    series,
  };
}
