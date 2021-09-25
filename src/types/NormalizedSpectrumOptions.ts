import { NormalizedFilters } from './NormalizedFilters';

export interface NormalizedSpectrumOptions {
  from?: number;
  to?: number;
  numberOfPoints?: number;
  processing?: boolean;
  filters?: NormalizedFilters[];
  exclusions?: string[];
  keepYUnits?: boolean;
}
