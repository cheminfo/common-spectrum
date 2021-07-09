import max from 'ml-array-max';
import { optimize as optimizePeak } from 'ml-spectra-fitting';
import { xFindClosestIndex } from 'ml-spectra-processing';

import type { SpectrumType, PeakPickingOptions } from '../types';

/** Based on a x value we will return a peak
 * if you set optimize=True the returned positions will be
 * the closest actual datapoints to the fitted peak location.
 * the x/y of the fitted peak will be in xOptimized and yOptimized
*/
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
    expectedWidth = 1,
    max: isMax = true,
    shapeOptions = {},
  } = options;

  const x = spectrum.variables[xVariable]?.data;
  let y;
  if (!isMax) {
    y = spectrum.variables[yVariable]?.data.slice(); // do deep copy as we maybe need to flip sign
  } else {
    y = spectrum.variables[yVariable]?.data;
  }

  if (!x || !y) return;
  let targetIndex;
  targetIndex = xFindClosestIndex(x, target);
  let optimizedPeak;
  let optimizedIndex;
  const result: Record<string, number> = {};
  if (optimize) {
    if (isMax === false) {
      let maximumY = max(y);
      for (let i = 0; i < y.length; i++) {
        y[i] *= -1;
        y[i] += maximumY; // This makes it somewhat more robust
      }
    }

    optimizedPeak = optimizePeak(
      { x, y },
      [{ x: x[targetIndex], y: y[targetIndex], width: expectedWidth }],
      shapeOptions,
    );

    optimizedIndex = xFindClosestIndex(x, optimizedPeak.peaks[0].x);
    for (let key in spectrum.variables) {
      result[key] = spectrum.variables[key].data[optimizedIndex];
    }
    result.width = optimizedPeak.peaks[0].width;
    result.xOptimized = optimizedPeak.peaks[0].x;
    result.yOptimized = optimizedPeak.peaks[0].y;
  } else {
    for (let key in spectrum.variables) {
      result[key] = spectrum.variables[key].data[targetIndex];
    }
  }

  return result;
}
