import { OneLowerCase } from './Cheminfo';
import { ShapeOptions } from './ShapeOptions';

export interface PeakPickingOptions {
  /** x variable label, by default 'x' */
  xVariable?: OneLowerCase;
  /** y variable label, by default 'y' */
  yVariable?: OneLowerCase;
  /** should we look for the closest min / max, default true */
  optimize?: boolean;
  /** options of the peak shape fit */
  shapeOptions?: ShapeOptions;
  /** are we looking for maxima or minima, default true */
  max?: boolean;
  expectedWidth?: number;
}
