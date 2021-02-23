import type {
  AxisProps,
  LineSeriesProps,
  PlotObjectType,
  PlotProps,
} from 'react-plot';

import { Analysis } from '../Analysis';
import { SelectorType } from '../types';

type LineSeriesType = { type: 'line' } & LineSeriesProps;
export interface ReactPlotOptions {
  xAxis?: AxisProps;
  yAxis?: AxisProps;
  series?: LineSeriesProps;
  dimentions?: Omit<PlotProps, 'colorScheme' | 'children'>;
}

/**
 * Parses from {x[], y[]} to [{x,y}]
 */
function getData(x: Array<number>, y: Array<number>) {
  let data = new Array(x.length);
  for (let i = 0; i < x.length; i++) {
    data[i] = { x: x[i], y: y[i] };
  }
  return data;
}

/**
 * Generate a jsgraph chart format from an array of Analysis
 */
export function getReactPlotJSON(
  analyses: Analysis[],
  query: SelectorType,
  options: ReactPlotOptions = {},
): PlotObjectType & { meta: Record<string, unknown>[] } {
  const {
    xAxis: xAxisOptions = {},
    yAxis: yAxisOptions = { labelSpace: 40 },
    series: seriesOptions = { displayMarker: true },
    dimentions = { width: 550, height: 500 },
  } = options;
  let series = [];
  let meta: Record<string, unknown>[] = [];
  let xAxis: AxisProps | null = null;
  let yAxis: AxisProps | null = null;

  for (const analysis of analyses) {
    const spectra = analysis.getXYSpectrum(query);
    if (!spectra) continue;

    if (spectra.meta) {
      meta.push(spectra.meta);
    }

    xAxis = {
      id: 'x',
      label: spectra.variables.x.label,
      ...xAxisOptions,
      position: 'bottom',
    };
    yAxis = {
      id: 'y',
      label: spectra.variables.y.label,
      ...yAxisOptions,
      position: 'left',
    };

    const data = getData(spectra.variables.x.data, spectra.variables.y.data);
    const serie: LineSeriesType = {
      type: 'line',
      label: spectra.title,
      data,
      ...seriesOptions,
    };
    series.push(serie);
  }

  if (xAxis === null || yAxis === null) {
    throw new Error('The axes were not defined');
  }

  return {
    series,
    axes: [xAxis, yAxis],
    dimentions,
    meta,
  };
}
