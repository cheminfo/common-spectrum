import { getJSGraph } from './jsgraph/getJSGraph';
import { getNormalizationAnnotations } from './jsgraph/getNormalizationAnnotations';
import { getReactPlotJSON } from './reactPlot/getReactPlotJSON';

export * from './AnalysesManager';
export * from './Analysis';
export * from './from/fromJcamp';
export * from './to/toJcamp';
export * from './to/toJcamps';
export * from './to/toText';
export * from './util/getNormalizedSpectrum';

export const JSGraph = {
  getJSGraph,
  getReactPlotJSON,
  getNormalizationAnnotations,
};
