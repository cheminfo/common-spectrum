// @ts-ignore
import { gsd } from 'ml-gsd';

import type { SpectrumType, AutoPeakPickingOptions } from '../types';

/** Based on a x value we will return a peak*/
export function autoPeakPicking(
  spectrum: SpectrumType,
  options: AutoPeakPickingOptions = {},
) {
  const { xVariable = 'x', yVariable = 'y' } = options;

  const x = spectrum.variables[xVariable]?.data;
  const y = spectrum.variables[yVariable]?.data;
  if (!x || !y) return;

  return gsd({ x, y }, options).map((peak: any) => {
    const result: Record<string, number> = {};
    for (let key in spectrum.variables) {
      result[key] = spectrum.variables[key].data[peak.index];
    }
    result.width = peak.width;
    return result;
  });
}
