import { DataXY } from 'cheminfo-types';
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

    let spectra = analysis.getNormalizedSpectra({
      selector,
      normalization,
    });
    if (spectra.length === 0) continue;
    const firstSpectrum = spectra[0];

    // todo: if many spectra are available and not xUnits / yUnits are specified we should ensure that all the3 spectra are compatible

    if (!xLabel) xLabel = firstSpectrum.variables.x.label;
    if (!yLabel) yLabel = firstSpectrum.variables.y.label;
    if (!xUnits) xUnits = firstSpectrum.variables.x.units;
    if (!yUnits) yUnits = firstSpectrum.variables.y.units;

    for (const spectrum of spectra) {
      let serie: Record<string, unknown> = {};
      addStyle(serie, analysis, {
        color: colors[i % colors.length],
        opacity: opacities[i % opacities.length],
        lineWidth: linesWidth[i % linesWidth.length],
      });
      serie.data = {
        x: spectrum.variables.x.data,
        y: spectrum.variables.y.data,
      };
      serie.id = spectrum.id;
      if (xAxis.logScale) {
        serie.data = xyFilterXPositive(serie.data as DataXY);
      }

      series.push(serie);
    }
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
