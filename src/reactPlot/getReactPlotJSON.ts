import type { AxisProps, LineSeriesProps, PlotObjectType } from 'react-plot';

import { Analysis } from '../Analysis';
import { MeasurementSelector } from '../types/MeasurementSelector';

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
  let data: DataXY[] = new Array(x.length);
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
  query: MeasurementSelector,
  options: ReactPlotOptions = {},
): PlotObjectType & { meta: Record<string, string>[] } {
  const {
    enforceGrowing = false,
    xAxis: xAxisOptions = {},
    yAxis: yAxisOptions = { labelSpace: 40 },
    content: seriesOptions = { displayMarker: true },
    dimensions = { width: 550, height: 500 },
    ...otherOptions
  } = options;
  let content: PlotObjectType['content'] = [];
  let meta: Record<string, string>[] = [];
  type Axes = { type: 'main' } & AxisProps;
  let xAxis: Axes | null = null;
  let yAxis: Axes | null = null;

  for (const analysis of analyses) {
    let measurements = enforceGrowing
      ? analysis.getNormalizedMeasurement({
          selector: query,
          normalization: {
            filters: [{ name: 'ensureGrowing' }],
            keepYUnits: true,
          },
        })
      : analysis.getMeasurementXY(query);
    if (!measurements) continue;

    if (measurements.meta) {
      meta.push(measurements.meta);
    }

    xAxis = {
      id: 'x',
      label:
        measurements.variables.x.label +
        (measurements.variables.x.units
          ? ` [${measurements.variables.x.units}]`
          : ''),
      ...xAxisOptions,
      position: 'bottom',
      type: 'main',
    };
    yAxis = {
      id: 'y',
      label:
        measurements.variables.y.label +
        (measurements.variables.y.units
          ? ` [${measurements.variables.y.units}]`
          : ''),
      ...yAxisOptions,
      position: 'left',
      type: 'main',
    };

    const data = getData(
      measurements.variables.x.data,
      measurements.variables.y.data,
    );
    const serie: LineSeriesType = {
      type: 'line',
      label: measurements.description,
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
