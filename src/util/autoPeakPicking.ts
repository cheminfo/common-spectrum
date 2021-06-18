// @ts-ignore
import { gsd } from 'ml-gsd';
import { xyMaxClosestYPoint, xyMinClosestYPoint } from 'ml-spectra-processing';

import type { SpectrumType, AutoPeakPickingOptions } from '../types';

import { getNormalizedSpectrum } from './getNormalizedSpectrum';

/** Based on a x value we will return a peak*/
export function autoPeakPicking(
  spectrum: SpectrumType,
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

  if (normalizationOptions) {
    const tempSpectrum: SpectrumType = {
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
  let { from, to } = options;

  let peaks: Array<{ x: number; y: number; width: number; index: number }> =
    gsd({ x, y }, options);

  if (normalizationOptions) {
    // we need to recalculate the real count
    const xyClosestYPoint =
      options.maxCriteria === undefined || options.maxCriteria
        ? xyMaxClosestYPoint
        : xyMinClosestYPoint;
    for (let peak of peaks) {
      const closest = xyClosestYPoint(
        { x: spectrum.variables.x.data, y: spectrum.variables.y.data },
        { target: peak.x },
      );
      peak.x = closest.x;
      peak.y = closest.y;
    }
  }

  if (from !== undefined) {
    peaks = peaks.filter((peak) => peak.x >= (from as number));
  }
  if (to !== undefined) {
    peaks = peaks.filter((peak) => peak.x <= (to as number));
  }
  if (minPeakWidth) {
    peaks = peaks.filter((peak) => peak.width >= minPeakWidth);
  }

  return peaks.map((peak) => {
    const result: Record<string, number> = {};
    for (let key in spectrum.variables) {
      result[key] = spectrum.variables[key].data[peak.index];
    }
    result.width = peak.width;
    return result;
  });
}
