import { xyFilterXPositive } from 'ml-spectra-processing';

import { Analysis } from '../Analysis';
import { NormalizedSpectrumOptions } from '../types/NormalizedSpectrumOptions';

import { addStyle } from './addStyle';
import { COLORS } from './colors';

interface JSGraphAxisOptions {
  /**
   * Change the scale to logarihtmic
   * @default false
   */
  logScale?: boolean;
  flipped?: boolean;
  display?: boolean;
  label?: string;
  units?: string;
}

interface JSGraphOptions {
  colors?: string[];
  opacities?: number[];
  linesWidth?: number[];
  selector?: Record<string, unknown>;
  normalization?: NormalizedSpectrumOptions;
  xAxis?: JSGraphAxisOptions;
  yAxis?: JSGraphAxisOptions;
}
/**
 * Generate a jsgraph chart format from an array of Analysis
 */
export function getJSGraph(analyses: Analysis[], options: JSGraphOptions = {}) {
  const {
    colors = COLORS,
    opacities = [1],
    linesWidth = [1],
    selector = {},
    normalization,
    xAxis = {},
    yAxis = {},
  } = options;
  let series = [];

  let xLabel = xAxis.label;
  let yLabel = yAxis.label;
  let xUnits = xAxis.units;
  let yUnits = yAxis.units;

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    let serie: Record<string, unknown> = {};
    let currentData = analysis.getNormalizedSpectrum({
      selector,
      normalization,
    });
    if (!currentData) continue;
    if (!xLabel) xLabel = currentData.variables.x.label;
    if (!yLabel) yLabel = currentData.variables.y.label;
    if (!xUnits) xUnits = currentData.variables.x.units;
    if (!yUnits) yUnits = currentData.variables.y.units;
    addStyle(serie, analysis, {
      color: colors[i % colors.length],
      opacity: opacities[i % opacities.length],
      lineWidth: linesWidth[i % linesWidth.length],
    });
    serie.data = {
      x: currentData.variables.x.data,
      y: currentData.variables.y.data,
    };

    if (xAxis.logScale) {
      serie.data = xyFilterXPositive(serie.data);
    }

    series.push(serie);
  }
  return {
    axes: {
      x: {
        label: xLabel,
        unit: xUnits,
        unitWrapperBefore: '(',
        unitWrapperAfter: ')',
        flipped: false,
        display: true,
        ...xAxis,
      },
      y: {
        label: yLabel,
        unit: yUnits,
        unitWrapperBefore: '(',
        unitWrapperAfter: ')',
        flipped: false,
        display: true,
        ...yAxis,
      },
    },
    series,
  };
}
