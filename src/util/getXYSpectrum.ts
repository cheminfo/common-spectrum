import type { MeasurementXY } from 'cheminfo-types';

import type { SpectrumSelector } from '../types/SpectrumSelector';

import { getXYSpectra } from './getXYSpectra';

/**
 * Retrieve the spectrum with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 * @param spectra
 * @param selector
 */
export function getXYSpectrum(
  spectra: MeasurementXY[] = [],
  selector: SpectrumSelector = {},
): MeasurementXY | undefined {
  const selectedSpectra = getXYSpectra(spectra, selector);
  if (selectedSpectra.length === 0) return undefined;
  return selectedSpectra[0];
}
