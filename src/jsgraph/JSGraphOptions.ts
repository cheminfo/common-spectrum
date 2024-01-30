import { NormalizedSpectrumOptions } from '../types/NormalizedSpectrumOptions';
import { JSGraphAxisOptions } from './JSGraphAxisOptions';

export interface JSGraphOptions {
  colors?: string[];
  opacities?: number[];
  linesWidth?: number[];
  selector?: Record<string, unknown>;
  normalization?: NormalizedSpectrumOptions;
  xAxis?: JSGraphAxisOptions;
  yAxis?: JSGraphAxisOptions;
}
