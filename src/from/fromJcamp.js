import { convert } from 'jcampconverter';

import { Analysis } from '../Analysis';

/**
 * Creates a new Analysis from a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @param {object} [options.flavor='']
 * @return {Analysis} - New class element with the given data
 */
export function fromJcamp(jcamp, options = {}) {
  let analysis = new Analysis(options);
  addJcamp(analysis, jcamp, options);
  return analysis;
}

function addJcamp(analysis, jcamp, options = {}) {
  const { defaultFlavor } = options;
  let converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
    canonicDataLabels: false,
    dynamicTyping: true,
  });

  for (let entry of converted.flatten) {
    let currentSpectrum = entry.spectra[0];
    let xLabel = currentSpectrum.xUnit;
    let yLabel = currentSpectrum.yUnit;

    let flavor = entry.info.$cheminfoFlavor || defaultFlavor;

    let meta = {};
    for (let key in entry.info) {
      if (key.startsWith('$') && key !== '$cheminfoFlavor') {
        meta[key.substring(1)] = entry.info[key];
      }
    }

    analysis.set(currentSpectrum.data, {
      flavor,
      xLabel,
      yLabel,
      title: entry.title,
      meta,
    });
  }
}
