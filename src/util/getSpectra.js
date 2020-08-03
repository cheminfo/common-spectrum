export function getSpectra(spectra, selector = {}) {
  const { index, flavor } = selector;
  if (index !== undefined) {
    return spectra[index] ? [spectra[index]] : undefined;
  }
  if (flavor === undefined || flavor === '') return spectra;
  return spectra.filter((spectrum) => spectrum.flavor === flavor);
}
