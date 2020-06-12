import { convert } from 'jcampconverter';

import { Analysis } from '../Analysis';

/**
 * Creates a new Analysis from a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @param {string} [options.label=options.id] human redeable label
 * @return {Analysis} - New class element with the given data
 */
export function fromJcamp(jcamp, options = {}) {
  let analysis = new Analysis(options);
  addJcamp(analysis, jcamp, options);
  return analysis;
}

function addJcamp(analysis, jcamp) {
  let converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
  });

  for (let entry of converted.flatten) {
    let currentSpectrum = entry.spectra[0];
    let xLabel = currentSpectrum.xUnits || 'x';
    let yLabel = currentSpectrum.yUnits || 'y';

    analysis.pushSpectrum(currentSpectrum.data, {
      xLabel,
      yLabel,
      dataType: entry.dataType,
      title: entry.title,
      meta: entry.meta,
    });
  }
}
