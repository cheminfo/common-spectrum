import { FromTo } from 'cheminfo-types';
import { FilterXYType } from 'ml-signal-processing/src/FilterXYType';

export interface NormalizedSpectrumOptions {
  from?: number;
  to?: number;
  numberOfPoints?: number;
  filters?: FilterXYType[];
  zones?: FromTo[];
  exclusions?: FromTo[];
}
