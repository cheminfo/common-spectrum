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
