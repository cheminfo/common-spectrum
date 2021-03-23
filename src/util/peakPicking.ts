import {
  xyMinClosestYPoint,
  xyMaxClosestYPoint,
  xFindClosestIndex,
} from 'ml-spectra-processing';

import type { SpectrumType, PeakPickingOptions } from '../types';

/** Based on a x value we will return a peak*/
export function peakPicking(
  spectrum: SpectrumType,
  /** value to search (on x axis) */
  target: number,
  options: PeakPickingOptions = {},
) {
  const {
    xVariable = 'x',
    yVariable = 'y',
    optimize = false,
    max = true,
  } = options;

  const x = spectrum.variables[xVariable]?.data;
  const y = spectrum.variables[yVariable]?.data;
  if (!x || !y) return;
  let targetIndex;
  if (optimize) {
    targetIndex = max
      ? xyMaxClosestYPoint({ x, y }, { target }).index
      : xyMinClosestYPoint({ x, y }, { target }).index;
  } else {
    targetIndex = xFindClosestIndex(x, target);
  }
  const result: Record<string, number> = {};
  for (let key in spectrum.variables) {
    result[key] = spectrum.variables[key].data[targetIndex];
  }
  return result;
}
