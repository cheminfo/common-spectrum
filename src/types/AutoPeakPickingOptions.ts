import { OneLowerCase } from 'cheminfo-types';
import { GSDOptions } from 'ml-gsd';

import { MeasurementNormalizationOptions } from './MeasurementNormalizationOptions';

export interface AutoPeakPickingOptions {
  /** x variable label, by default 'x' */
  xVariable?: OneLowerCase;
  /** y variable label, by default 'y' */
  yVariable?: OneLowerCase;
  /** First X value for the peak picking (default: first X value */
  from?: number;
  /** Last X value for the peak picking (default: last X value */
  to?: number;
  /** Normalization can be applied before peak picking. This is useful for example to correct baseline while still have a minMaxRatio filter */
  normalizationOptions?: MeasurementNormalizationOptions;
  /** Options for the peak picking */
  gsdOptions?: GSDOptions;
  /** Minimal peak width */
  minPeakWidth?: number;
}
