import type { Analysis } from '../Analysis.js';

import type { GetJcampOptions } from './toJcamps.js';
import { toJcamps } from './toJcamps.js';

/**
 * Convert an Analysis to a single JCAMP string (all spectra joined).
 * @param analysis - The analysis to convert
 * @param options - Options for the JCAMP output
 * @returns JCAMP string
 */
export function toJcamp(analysis: Analysis, options: GetJcampOptions = {}) {
  return toJcamps(analysis, options).join('\n');
}
