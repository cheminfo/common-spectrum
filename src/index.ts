import { getJSGraph } from './jsgraph/getJSGraph';
import { getNormalizationAnnotations } from './jsgraph/getNormalizationAnnotations';

export * from './AnalysesManager';
export * from './Analysis';
export * from './from/fromJcamp';
export * from './to/toJcamp';
export * from './to/toJcamps';
export * from './to/toText';
export * from './util/getNormalizedSpectrum';

export * from './util/peakPicking';
export * from './util/autoPeakPicking';

export { getReactPlotJSON } from './reactPlot/getReactPlotJSON';

export const JSGraph = {
  getJSGraph,
  getNormalizationAnnotations,
};
