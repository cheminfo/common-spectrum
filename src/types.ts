export type json = Record<string, string>;

export interface SelectorType {
  units?: string;
  xUnits?: string;
  yUnits?: string;
  labels?: string;
  xLabel?: string | RegExp;
  yLabel?: string | RegExp;
  dataType?: string | RegExp;
  title?: string | RegExp;
  meta?: Record<string, string>;
}
export interface CounterType {
  key: string;
  count: number;
}
export interface DifferentType extends CounterType {
  values: string[];
}
export interface VariableType {
  data: number[] | Float64Array;
  symbol?: string;
  label: string;
  units?: string;
  min?: number;
  max?: number;
  isMonotone?: boolean;
}
export interface SpectrumType {
  variables: Record<string, VariableType>;
  title?: string;
  dataType?: string;
  meta?: json;
  tmp?: json;
}
export interface MultipleType {
  series: Array<{
    x: number[];
    y: number[];
    label: string;
  }>;
  axis: {
    x: { label: string };
    y: { label: string };
  };
}
export interface NormalizedFilters {
  name:
    | 'airPLSBaseline'
    | 'centerMean'
    | 'divideBySD'
    | 'divideByMax'
    | 'enforceScale'
    | 'normalize'
    | 'multiply'
    | 'add'
    | 'rollingAverageBaseline'
    | 'iterativePolynomialBaseline'
    | 'rollingballBaseline'
    | 'rollingMedianBaseline'
    | 'rescale';
  options?: Record<string, unknown>;
}
export interface NormalizedSpectrumOptions {
  from?: number;
  to?: number;
  numberOfPoints?: number;
  processing?: boolean;
  filters?: NormalizedFilters[];
  exclusions?: string[];
}
export interface PlotObject {
  series: Array<{
    type: 'line';
    displayMarker: boolean;
    label: string;
    data: Array<{ x: number; y: number }>;
  }>;
  axes: Array<{ position: 'bottom' | 'left'; label: string }>;
  dimentions: { width: number; heigth: number };
  meta: json[];
}
