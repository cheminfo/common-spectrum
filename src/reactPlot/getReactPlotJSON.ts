import type { AxisProps, LineSeriesProps, PlotObjectType } from 'react-plot';

import { Analysis } from '../Analysis';
import { SpectrumSelector } from '../types/SpectrumSelector';

type LineSeriesType = { type: 'line' } & LineSeriesProps;
export type ReactPlotOptions = Omit<PlotObjectType, 'axes' | 'content'> & {
  enforceGrowing?: boolean;
  xAxis?: Partial<AxisProps>;
  yAxis?: Partial<AxisProps>;
  content?: Partial<LineSeriesProps>;
};

/**
 * Parses from {x[], y[]} to [{x,y}]
 */
interface DataXY {
  x: number;
  y: number;
}
type ListNumber = number[] | Float64Array;
function getData(x: ListNumber, y: ListNumber) {
  const data: DataXY[] = new Array(x.length);
  for (let i = 0; i < x.length; i++) {
    data[i] = { x: x[i], y: y[i] };
  }
  return data;
}

/**
 * Generate a jsgraph chart format from an array of Analysis
 * @param analyses
 * @param query
 * @param options
 */
export function getReactPlotJSON(
  analyses: Analysis[],
  query: SpectrumSelector,
  options: ReactPlotOptions = {},
): PlotObjectType & { meta: Array<Record<string, string>> } {
  const {
    enforceGrowing = false,
    xAxis: xAxisOptions = {},
    yAxis: yAxisOptions = { labelSpace: 40 },
    content: seriesOptions = { displayMarker: true },
    dimensions = { width: 550, height: 500 },
    ...otherOptions
  } = options;
  const content: PlotObjectType['content'] = [];
  const meta: Array<Record<string, string>> = [];
  type Axes = { type: 'main' } & AxisProps;
  let xAxis: Axes | null = null;
  let yAxis: Axes | null = null;

  for (const analysis of analyses) {
    const spectra = enforceGrowing
      ? analysis.getNormalizedSpectrum({
          selector: query,
          normalization: {
            filters: [{ name: 'ensureGrowing' }],
          },
        })
      : analysis.getXYSpectrum(query);
    if (!spectra) continue;

    if (spectra.meta) {
      meta.push(spectra.meta);
    }

    xAxis = {
      id: 'x',
      label:
        spectra.variables.x.label +
        (spectra.variables.x.units ? ` [${spectra.variables.x.units}]` : ''),
      ...xAxisOptions,
      position: 'bottom',
      type: 'main',
    };
    yAxis = {
      id: 'y',
      label:
        spectra.variables.y.label +
        (spectra.variables.y.units ? ` [${spectra.variables.y.units}]` : ''),
      ...yAxisOptions,
      position: 'left',
      type: 'main',
    };

    const data = getData(spectra.variables.x.data, spectra.variables.y.data);
    const serie: LineSeriesType = {
      type: 'line',
      label: spectra.title,
      data,
      ...seriesOptions,
    };
    content.push(serie);
  }

  if (xAxis === null || yAxis === null) {
    throw new Error('The axes were not defined');
  }

  return {
    content,
    axes: [xAxis, yAxis],
    dimensions,
    meta,
    ...otherOptions,
  };
}
