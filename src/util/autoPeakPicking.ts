import type { MeasurementXY } from 'cheminfo-types';
import { gsd } from 'ml-gsd';
import { xyMaxClosestYPoint, xyMinClosestYPoint } from 'ml-spectra-processing';

import type { AutoPeakPickingOptions } from '../types/AutoPeakPickingOptions.js';

import { getNormalizedSpectrum } from './getNormalizedSpectrum.js';

/**
 * Based on a x value we will return a peak
 * @param spectrum
 * @param options
 */
export function autoPeakPicking(
  spectrum: MeasurementXY,
  options: AutoPeakPickingOptions = {},
) {
  const {
    xVariable = 'x',
    yVariable = 'y',
    normalizationOptions,
    minPeakWidth,
  } = options;

  let x = spectrum.variables[xVariable]?.data;
  let y = spectrum.variables[yVariable]?.data;
  if (!x || !y) return [];

  if (normalizationOptions) {
    const tempSpectrum: MeasurementXY = {
      variables: {
        x: { data: x, label: '' },
        y: { data: y, label: '' },
      },
    };
    const normalizedSpectrum = getNormalizedSpectrum(
      tempSpectrum,
      normalizationOptions,
    );
    x = normalizedSpectrum.variables.x.data;
    y = normalizedSpectrum.variables.y.data;
  }

  if (!x || !y) return;
  const { from, to } = options;

  let peaks: Array<{ x: number; y: number; width: number; index: number }> =
    gsd({ x, y }, options);

  if (normalizationOptions) {
    // we need to recalculate the real count
    const xyClosestYPoint =
      options.maxCriteria === undefined || options.maxCriteria
        ? xyMaxClosestYPoint
        : xyMinClosestYPoint;
    for (const peak of peaks) {
      const closest = xyClosestYPoint(
        { x: spectrum.variables.x.data, y: spectrum.variables.y.data },
        { target: peak.x },
      );
      peak.x = closest.x;
      peak.y = closest.y;
    }
  }

  if (from !== undefined) {
    peaks = peaks.filter((peak) => peak.x >= from);
  }
  if (to !== undefined) {
    peaks = peaks.filter((peak) => peak.x <= to);
  }
  if (minPeakWidth) {
    peaks = peaks.filter((peak) => peak.width >= minPeakWidth);
  }

  return peaks.map((peak) => {
    const result: Record<string, number> = {};
    for (const [key, variable] of Object.entries(spectrum.variables)) {
      result[key] = variable.data[peak.index];
    }
    result.width = peak.width;
    return result;
  });
}
