// @ts-ignore
import { gsd } from 'ml-gsd';
import { xFindClosestIndex } from 'ml-spectra-processing';

import type { SpectrumType, AutoPeakPickingOptions } from '../types';

/** Based on a x value we will return a peak*/
export function autoPeakPicking(
  spectrum: SpectrumType,
  options: AutoPeakPickingOptions = {},
) {
  const { xVariable = 'x', yVariable = 'y' } = options;

  let x = spectrum.variables[xVariable]?.data;
  let y = spectrum.variables[yVariable]?.data;
  if (!x || !y) return;
  let { from, to } = options;
  let fromIndex = 0;
  if (from !== undefined || to !== undefined) {
    if (from === undefined) from = x[0];
    if (to === undefined) to = x[x.length - 1];
    fromIndex = xFindClosestIndex(x, from);
    let toIndex = xFindClosestIndex(x, to);
    x = x.slice(fromIndex, toIndex + 1);
    y = y.slice(fromIndex, toIndex + 1);
  }

  return gsd({ x, y }, options).map((peak: any) => {
    const result: Record<string, number> = {};
    for (let key in spectrum.variables) {
      result[key] = spectrum.variables[key].data[peak.index + fromIndex];
    }
    result.width = peak.width;
    return result;
  });
}
