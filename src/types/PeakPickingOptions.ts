import { Shape1D } from 'ml-peak-shape-generator';

import { OneLowerCase } from './Cheminfo';

export interface PeakPickingOptions {
  /** x variable label, by default 'x' */
  xVariable?: OneLowerCase;
  /** y variable label, by default 'y' */
  yVariable?: OneLowerCase;
  /** should we look for the closest min / max, default true */
  optimize?: boolean;
  /** options of the peak shape fit */
  shape?: Shape1D;
  /** are we looking for maxima or minima, default true */
  max?: boolean;
}
