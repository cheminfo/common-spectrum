/**
 * Parses from {x[], y[]} to [{x,y}]
 * @param {Array<number>} x
 * @param {Array<number>} y
 */
function getData(x, y) {
  let data = new Array(x.length);
  for (let i = 0; i <= x.length; i++) {
    data[i] = { x: x[i], y: y[i] };
  }
  return data;
}

/**
 * Generate a jsgraph chart format from an array of Analysis
 * @param {Array<Analysis>} analyses
 * @param {object} selector
 */
export function getReactPlotJSON(analyses, selector) {
  let series = [];
  let xAxis;
  let yAxis;

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    const spectra = analysis.getXYSpectrum(selector);
    if (!spectra) continue;

    xAxis = { position: 'bottom', label: spectra.variables.x.label };
    yAxis = { position: 'left', label: spectra.variables.y.label };

    const data = getData(spectra.variables.x.data, spectra.variables.y.data);
    const serie = {
      type: 'line',
      displayMarker: true,
      label: spectra.title,
      data,
    };
    series.push(serie);
  }

  return {
    series,
    axes: [xAxis, yAxis],
    dimentions: { width: 550, height: 500 },
  };
}
