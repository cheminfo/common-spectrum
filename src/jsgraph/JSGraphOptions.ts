import type { NormalizedSpectrumOptions } from '../types/NormalizedSpectrumOptions.js';

import type { JSGraphAxisOptions } from './JSGraphAxisOptions.js';

export interface JSGraphOptions {
  colors?: string[];
  opacities?: number[];
  linesWidth?: number[];
  selector?: Record<string, unknown>;
  normalization?: NormalizedSpectrumOptions;
  xAxis?: JSGraphAxisOptions;
  yAxis?: JSGraphAxisOptions;
}
