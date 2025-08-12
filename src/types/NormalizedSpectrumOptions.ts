import type { FromTo } from 'cheminfo-types';
import type { FilterXYType } from 'ml-signal-processing';

export interface NormalizedSpectrumOptions {
  filters?: FilterXYType[];
  /**
   * If true, the x/y points based on from, to, zones and exclusionswill be selected before applying the filters.
   * @default false
   */
  applyRangeSelectionFirst?: boolean;
  from?: number;
  to?: number;
  numberOfPoints?: number;
  zones?: FromTo[];
  exclusions?: FromTo[];
}
