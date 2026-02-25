import type { DoubleArray, MeasurementXY, OneLowerCase } from 'cheminfo-types';
import type { Shape1D } from 'ml-peak-shape-generator';
import { optimize as optimizePeak } from 'ml-spectra-fitting';
import { xFindClosestIndex, xMaxValue } from 'ml-spectra-processing';

export interface PeakPickingOptions {
  /** x variable label, by default 'x' */
  xVariable?: OneLowerCase;
  /** y variable label, by default 'y' */
  yVariable?: OneLowerCase;
  /** should we look for the closest min / max, default true */
  optimize?: boolean;
  /** options of the peak shape fit */
  shape?: Shape1D;
  /** are we looking for maxima or minima, default true */
  max?: boolean;
}

/**
 * Based on a x value we will return a peak
 * if you set optimize=True the returned positions will be
 * the closest actual datapoints to the fitted peak location.
 * the x/y of the fitted peak will be in xOptimized and yOptimized
 * @param spectrum
 * @param target
 * @param options
 */
export function peakPicking(
  spectrum: MeasurementXY,
  /** value to search (on x axis) */
  target: number,
  options: PeakPickingOptions = {},
) {
  const {
    xVariable = 'x',
    yVariable = 'y',
    optimize = false,
    max: isMax = true,
    shape = { kind: 'gaussian', fwhm: 1 },
  } = options;

  const x = spectrum.variables[xVariable]?.data as DoubleArray;
  let y;
  if (!isMax) {
    y = spectrum.variables[yVariable]?.data.slice(); // do deep copy as we maybe need to flip sign
  } else {
    y = spectrum.variables[yVariable]?.data;
  }

  if (!x || !y) return;
  const targetIndex = xFindClosestIndex(x, target);
  let optimizedPeak;
  let optimizedIndex;

  const result: {
    optimized?: any;
    [key: string]: number;
  } = {};
  if (optimize) {
    if (!isMax) {
      const maximumY = xMaxValue(y);
      for (let i = 0; i < y.length; i++) {
        y[i] *= -1;
        y[i] += maximumY; // This makes it somewhat more robust
      }
    }

    optimizedPeak = optimizePeak(
      { x, y },
      [{ x: x[targetIndex], y: y[targetIndex] }],
      { shape },
    );

    optimizedIndex = xFindClosestIndex(x, optimizedPeak.peaks[0].x);

    for (const [key, variable] of Object.entries(spectrum.variables)) {
      result[key] = variable.data[optimizedIndex];
    }
    result.optimized = optimizedPeak.peaks[0];
  } else {
    for (const [key, variable] of Object.entries(spectrum.variables)) {
      result[key] = variable.data[targetIndex];
    }
  }

  return result;
}
