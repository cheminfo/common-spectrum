import type { MeasurementXY, OneLowerCase } from 'cheminfo-types';
import type { GSDOptions } from 'ml-gsd';
import { gsd } from 'ml-gsd';
import type { Shape1D } from 'ml-peak-shape-generator';
import { xyMaxClosestYPoint, xyMinClosestYPoint } from 'ml-spectra-processing';

import type { NormalizedSpectrumOptions } from '../types/NormalizedSpectrumOptions.js';

import { getNormalizedSpectrum } from './getNormalizedSpectrum.js';

export interface AutoPeakPickingOptions extends GSDOptions {
  /** x variable label, by default 'x' */
  xVariable?: OneLowerCase;
  /** y variable label, by default 'y' */
  yVariable?: OneLowerCase;
  shape?: Shape1D;
  /** First X value for the peak picking (default: first X value) */
  from?: number;
  /** Last X value for the peak picking (default: last X value) */
  to?: number;
  /** Normalization can be applied before peak picking. This is useful for example to correct baseline while still have a minMaxRatio filter */
  normalizationOptions?: NormalizedSpectrumOptions;
  /** Minimal peak width */
  minPeakWidth?: number;
}

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
