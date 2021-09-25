import { SpectrumVariable } from 'cheminfo-types';
import { json } from './types';

export interface SpectrumType {
  variables: Record<string, SpectrumVariable>;
  title?: string;
  dataType?: string;
  meta?: json;
  tmp?: json;
}
