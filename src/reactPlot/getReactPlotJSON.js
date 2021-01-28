/**
 * Parses from {x[], y[]} to [{x,y}]
 * @param {Array<number>} x
 * @param {Array<number>} y
 */
function getData(x, y) {
  let data = new Array(x.length);
  for (let i = 0; i < x.length; i++) {
    data[i] = { x: x[i], y: y[i] };
  }
  return data;
}

/**
 * Generate a jsgraph chart format from an array of Analysis
 * @param {Array<Analysis>} analyses
 * @param {object} query
 * @param {object} [options]
 * @param {object} [options.xAxis]
 * @param {object} [options.yAxis]
 * @param {object} [options.series]
 * @param {object} [options.dimentions]
 */
export function getReactPlotJSON(analyses, query, options = {}) {
  const {
    xAxis: xAxisOptions = {},
    yAxis: yAxisOptions = { labelSpace: 40 },
    series: seriesOptions = { displayMarker: true },
    dimentions = { width: 550, height: 500 },
  } = options;
  let series = [];
  let meta = [];
  let xAxis;
  let yAxis;

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    const spectra = analysis.getXYSpectrum(query);
    if (!spectra) continue;

    meta.push(spectra.meta);

    xAxis = {
      id: 'x',
      label: spectra.variables.x.label,
      ...xAxisOptions,
      position: 'bottom',
    };
    yAxis = {
      id: 'y',
      label: spectra.variables.y.label,
      ...yAxisOptions,
      position: 'left',
    };

    const data = getData(spectra.variables.x.data, spectra.variables.y.data);
    const serie = {
      type: 'line',
      label: spectra.title,
      data,
      ...seriesOptions,
    };
    series.push(serie);
  }

  return {
    series,
    axes: [xAxis, yAxis],
    dimentions,
    meta,
  };
}
