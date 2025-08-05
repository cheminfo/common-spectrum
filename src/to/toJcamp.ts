import type { Analysis } from '../Analysis.js';

import { toJcamps } from './toJcamps.js';

interface GetJcampOptions {
  info?: Record<string, string>;
  meta?: Record<string, string>;
}
export function toJcamp(analysis: Analysis, options: GetJcampOptions = {}) {
  return toJcamps(analysis, options).join('\n');
}
