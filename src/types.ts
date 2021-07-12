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
  /** Allows to specify X and Y variables using a string like 'c vs d' */
  variables?: string;
  /** Select a specific X variable by one letter name
   * @default 'x'
   */
  xVariable?: string;
  /** Select a specific Y variable by one letter name
   * @default 'y'
   */
  yVariable?: string;
  /** Select based on the data type */
  dataType?: string | RegExp;
  /** Select based on the title field */
  title?: string | RegExp;
  /** Select based on the presence of a meta information */
  meta?: Record<string, string>;
  /** Minimal peak width
   * @default 0
   */
  minPeakWidth?: number;
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

export interface PeakPickingOptions {
  /** x variable label, by default 'x' */
  xVariable?: string;
  /** y variable label, by default 'y' */
  yVariable?: string;
  /** should we look for the closest min / max, default true */
  optimize?: boolean;
  /** options of the peak shape fit */
  shapeOptions?: ShapeOptions;
  /** are we looking for maxima or minima, default true */
  max?: boolean;
  expectedWidth?: number;
}

export interface ShapeOptions {
  /** kind of shape; lorentzian, gaussian and pseudovoigt are supported. */
  kind?: string;
  /** options depending the kind of shape */
  options?: any;
}

export interface SGOptions {
  /** Points to use in the approximations (default: 9) */
  windowSize?: number;
  /** Degree of the polynomial to use in the approximations (default: 3) */
  polynomial?: number;
}
export interface AutoPeakPickingOptions {
  /** x variable label, by default 'x' */
  xVariable?: string;
  /** y variable label, by default 'y' */
  yVariable?: string;
  shape?: ShapeOptions;
  /** Savitzky-Golay parameters used for global spectra deconvolution. windowSize should be odd; polynomial is the degree of the polynomial to use in the approximations. It should be bigger than 2. */
  sgOptions?: SGOptions;
  /** Noise threshold in spectrum units (default: 0) */
  noiseLevel?: number;
  /** First X value for the peak picking (default: first X value */
  from?: number;
  /** Last X value for the peak picking (default: last X value */
  to?: number;
  /** Peaks are local maximum (true) or minimum (false) (default: true) */
  maxCriteria?: boolean;
  /** Threshold to determine if a given peak should be considered as a noise (default: 0.00025 */
  minMaxRatio?: number;
  /** Normalization can be applied before peak picking. This is useful for example to correct baseline while still have a minMaxRatio filter */
  normalizationOptions?: NormalizedSpectrumOptions;
  /** Minimal peak width */
  minPeakWidth?: number;
}
