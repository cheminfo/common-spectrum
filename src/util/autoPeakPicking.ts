import type { MeasurementXY } from 'cheminfo-types';
// @ts-ignore
import { gsd } from 'ml-gsd';
import { xyMaxClosestYPoint, xyMinClosestYPoint } from 'ml-spectra-processing';

import { AutoPeakPickingOptions } from '../types/AutoPeakPickingOptions';

import { getNormalizedMeasurement } from './getNormalizedMeasurement';

/** Based on a x value we will return a peak*/
export function autoPeakPicking(
  measurement: MeasurementXY,
  options: AutoPeakPickingOptions = {},
) {
  const {
    xVariable = 'x',
    yVariable = 'y',
    normalizationOptions,
    minPeakWidth,
    gsdOptions = {},
  } = options;

  let x = measurement.variables[xVariable]?.data;
  let y = measurement.variables[yVariable]?.data;

  if (!x || !y) return [];

  if (normalizationOptions) {
    const tempMeasurement: MeasurementXY = {
      variables: {
        x: { data: x, label: '' },
        y: { data: y, label: '' },
      },
    };
    const normalizedMeasurement = getNormalizedMeasurement(
      tempMeasurement,
      normalizationOptions,
    );
    x = normalizedMeasurement.variables.x.data;
    y = normalizedMeasurement.variables.y.data;
  }

  if (!x || !y) return;
  let { from, to } = options;

  let peaks: Array<{ x: number; y: number; width: number; index: number }> =
    gsd({ x, y }, gsdOptions);

  if (normalizationOptions) {
    // we need to recalculate the real count
    const xyClosestYPoint =
      gsdOptions.maxCriteria === undefined || gsdOptions.maxCriteria
        ? xyMaxClosestYPoint
        : xyMinClosestYPoint;
    for (let peak of peaks) {
      const closest = xyClosestYPoint(
        {
          x: measurement.variables.x.data,
          y: measurement.variables.y.data,
        },
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
    for (const [key, variable] of Object.entries(measurement.variables)) {
      result[key] = variable.data[peak.index];
    }
    result.width = peak.width;
    return result;
  });
}
