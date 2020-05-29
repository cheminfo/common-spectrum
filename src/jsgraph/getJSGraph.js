import { addStyle } from './addStyle';

/**
 * Retrieve a chart with selected original data
 * @param {SpectraManager} spectraManager
 * @param {object} [options={}]
 * @param {Array} [options.ids] List of spectra ids, by all
 * @param {Array} [options.colors] List of colors
 * @param {Array} [options.flavor]
 * @param {object} [options.normalization]
 */
export function getJSGraph(spectraManager, options = {}) {
  const { ids, colors, flavor, normalization } = options;
  let spectra = spectraManager.getSpectra({ ids });
  let series = [];

  let xLabel = '';
  let yLabel = '';

  for (let i = 0; i < spectra.length; i++) {
    const spectrum = spectra[i];
    let serie = {};
    let currentData = spectrum.getData({ flavor, normalization });
    if (!currentData) continue;
    if (!xLabel) xLabel = spectrum.getXLabel(flavor);
    if (!yLabel) yLabel = spectrum.getYLabel(flavor);
    addStyle(serie, spectrum, { color: colors[i] });
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
