import type { GSDOptions } from 'ml-gsd';
import type { Shape1D } from 'ml-peak-shape-generator';

import type { OneLowerCase } from './Cheminfo';
import type { NormalizedSpectrumOptions } from './NormalizedSpectrumOptions';

export interface AutoPeakPickingOptions extends GSDOptions {
  /** x variable label, by default 'x' */
  xVariable?: OneLowerCase;
  /** y variable label, by default 'y' */
  yVariable?: OneLowerCase;
  shape?: Shape1D;
  /** First X value for the peak picking (default: first X value */
  from?: number;
  /** Last X value for the peak picking (default: last X value */
  to?: number;
  /** Normalization can be applied before peak picking. This is useful for example to correct baseline while still have a minMaxRatio filter */
  normalizationOptions?: NormalizedSpectrumOptions;
  /** Minimal peak width */
  minPeakWidth?: number;
}
