import type { FromTo } from 'cheminfo-types';
import type { FilterXYType } from 'ml-signal-processing';

export interface NormalizedSpectrumOptions {
  from?: number;
  to?: number;
  numberOfPoints?: number;
  filters?: FilterXYType[];
  zones?: FromTo[];
  exclusions?: FromTo[];
}
