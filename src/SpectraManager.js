export class SpectraManager {
  constructor() {
    this.spectra = [];
  }

  addSpectrum(spectrum) {
    let index = this.getSpectrumIndex(spectrum.id);
    if (index === undefined) {
      this.spectra.push(spectrum);
    } else {
      this.spectra[index] = spectrum;
    }
  }

  getSpectra(options = {}) {
    const { ids } = options;
    let spectra = [];
    for (const spectrum of this.spectra) {
      if (!ids || ids.includes(spectrum.id)) {
        spectra.push(spectrum);
      }
    }
    return spectra;
  }

  /**
   * Remove the spectrum from the SpectraProcessor for the specified id
   * @param {string} id
   */
  removeSpectrum(id) {
    let index = this.getSpectrumIndex(id);
    if (index === undefined) return undefined;
    return this.spectra.splice(index, 1);
  }

  /**
   * Returns the index of the spectrum in the spectra array
   * @param {string} id
   * @returns {number}
   */
  getSpectrumIndex(id) {
    if (!id) return undefined;
    for (let i = 0; i < this.spectra.length; i++) {
      let spectrum = this.spectra[i];
      if (spectrum.id === id) return i;
    }
    return undefined;
  }

  /**
   * Checks if the ID of a spectrum exists in the SpectraProcessor
   * @param {string} id
   */
  contains(id) {
    return !isNaN(this.getSpectrumIndex(id));
  }
}
