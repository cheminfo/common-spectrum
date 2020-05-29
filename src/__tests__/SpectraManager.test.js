import { SpectraManager } from '../SpectraManager';
import { Spectrum } from '../Spectrum';

describe('spectraManager', () => {
  const spectraManager = new SpectraManager();
  it('check add / remove', () => {
    let spectrum = new Spectrum({ id: 'abc' });
    spectraManager.addSpectrum(spectrum);
    expect(spectraManager.spectra).toHaveLength(1);
    expect(spectraManager.getSpectrumIndex('abc')).toBe(0);
    spectraManager.addSpectrum(spectrum);
    expect(spectraManager.spectra).toHaveLength(1);
    let spectrum2 = new Spectrum({ id: 'def' });
    spectraManager.addSpectrum(spectrum2);
    expect(spectraManager.spectra).toHaveLength(2);
    expect(spectraManager.getSpectrumIndex('def')).toBe(1);
    spectraManager.removeSpectrum('abc');
    expect(spectraManager.spectra).toHaveLength(1);
    expect(spectraManager.getSpectrumIndex('def')).toBe(0);
  });
});
