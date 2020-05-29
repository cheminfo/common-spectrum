import { convert } from 'jcampconverter';

import { Spectrum } from '../Spectrum';

/**
 * Creates a new Chromatogram element based in a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @return {Spectrum} - New class element with the given data
 */
export function fromJcamp(jcamp, options = {}) {
  let spectrum = new Spectrum(options);
  addJcamp(spectrum, jcamp);
  return spectrum;
}

function addJcamp(spectrum, jcamp) {
  let converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
    canonicDataLabels: false,
    dynamicTyping: true,
  });

  for (let entry of converted.flatten) {
    let currentSpectrum = entry.spectra[0];
    let xLabel = currentSpectrum.xUnit;
    let yLabel = currentSpectrum.yUnit;

    let flavor = entry.info.$cheminfoFlavor || '';

    spectrum.set(currentSpectrum.data, {
      flavor,
      xLabel,
      yLabel,
      title: currentSpectrum.title,
    });
  }
}
