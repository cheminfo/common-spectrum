import { OneLowerCase } from 'cheminfo-types/src/index';

import { NormalizedSpectrumOptions } from './NormalizedSpectrumOptions';
import { SGOptions } from './SGOptions';
import { ShapeOptions } from './ShapeOptions';

export interface AutoPeakPickingOptions {
  /** x variable label, by default 'x' */
  xVariable?: OneLowerCase;
  /** y variable label, by default 'y' */
  yVariable?: OneLowerCase;
  shape?: ShapeOptions;
  /** Savitzky-Golay parameters used for global spectra deconvolution. windowSize should be odd; polynomial is the degree of the polynomial to use in the approximations. It should be bigger than 2. */
  sgOptions?: SGOptions;
  /** Noise threshold in spectrum units (default: 0) */
  noiseLevel?: number;
  /** First X value for the peak picking (default: first X value */
  from?: number;
  /** Last X value for the peak picking (default: last X value */
  to?: number;
  /** Peaks are local maximum (true) or minimum (false) (default: true) */
  maxCriteria?: boolean;
  /** Threshold to determine if a given peak should be considered as a noise (default: 0.00025 */
  minMaxRatio?: number;
  /** Normalization can be applied before peak picking. This is useful for example to correct baseline while still have a minMaxRatio filter */
  normalizationOptions?: NormalizedSpectrumOptions;
  /** Minimal peak width */
  minPeakWidth?: number;
}
