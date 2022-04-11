import { FromTo } from 'cheminfo-types';
import { FilterType } from 'ml-signal-processing/lib/FilterType';

export interface NormalizedSpectrumOptions {
  from?: number;
  to?: number;
  numberOfPoints?: number;
  processing?: boolean;
  filters?: FilterType[];
  zones?: FromTo[];
  exclusions?: FromTo[];
  keepYUnits?: boolean;
}
