export type json = Record<string, string>;

export interface SelectorType {
  /** Allows to specify 2 units using a string like 'nm vs °C' */
  units?: string;
  /** Filter based on xUnits */
  xUnits?: string;
  /** Filter based on yUnits */
  yUnits?: string;
  /** Allows to specify 2 labels using a string like 'nm vs °C' */
  labels?: string;
  /** Filter based on xLabel */
  xLabel?: string | RegExp;
  /** Filter based on yLabel */
  yLabel?: string | RegExp;
  /** Select a specific X variable by one letter name */
  xVariable?: string;
  /** Select a specific Y variable by one letter name */
  yVariable?: string;
  /** Select based on the data type */
  dataType?: string | RegExp;
  /** Select based on the title field */
  title?: string | RegExp;
  /** Select based on the presence of a meta information */
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
    | 'ensureGrowing'
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
  keepYUnits?: boolean;
}
export interface PlotObject {
  series: Array<{
    type: 'line';
    displayMarker: boolean;
    label: string;
    data: Array<{ x: number; y: number }>;
  }>;
  axes: Array<{ position: 'bottom' | 'left'; label: string }>;
  dimensions: { width: number; heigth: number };
  meta: json[];
}
