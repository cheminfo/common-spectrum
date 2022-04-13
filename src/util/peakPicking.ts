import max from 'ml-array-max';
import { optimize as optimizePeak } from 'ml-spectra-fitting';
import { xFindClosestIndex } from 'ml-spectra-processing';

import type { Spectrum } from '../types/Cheminfo';
import { PeakPickingOptions } from '../types/PeakPickingOptions';

/** Based on a x value we will return a peak
 * if you set optimize=True the returned positions will be
 * the closest actual datapoints to the fitted peak location.
 * the x/y of the fitted peak will be in xOptimized and yOptimized
 */
export function peakPicking(
  spectrum: Spectrum,
  /** value to search (on x axis) */
  target: number,
  options: PeakPickingOptions = {},
) {
  const {
    xVariable = 'x',
    yVariable = 'y',
    optimize = false,
    expectedFWHM = 1,
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

  const result: {
    optimized?: any;
    [key: string]: number;
  } = {};
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
      [{ x: x[targetIndex], y: y[targetIndex], fwhm: expectedFWHM }],
      shapeOptions,
    );

    optimizedIndex = xFindClosestIndex(x, optimizedPeak.peaks[0].x);

    for (let [key, variable] of Object.entries(spectrum.variables)) {
      result[key] = variable.data[optimizedIndex];
    }
    result.optimized = optimizedPeak.peaks[0];
  } else {
    for (let [key, variable] of Object.entries(spectrum.variables)) {
      result[key] = variable.data[targetIndex];
    }
  }

  return result;
}
