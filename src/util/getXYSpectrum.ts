import type {
  OneLowerCase,
  Spectrum,
  MeasurementVariables,
} from '../types/Cheminfo';
import { SpectrumSelector } from '../types/SpectrumSelector';

import { getXYSpectra } from './getXYSpectra';

/**
 * Retrieve the spectrum with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 */
export function getXYSpectrum(
  spectra: Array<Spectrum> = [],
  selector: SpectrumSelector = {},
): Spectrum | undefined {
  const selectedSpectra = getXYSpectra(spectra, selector);
  if (selectedSpectra.length === 0) return undefined;
  return selectedSpectra[0];
}
