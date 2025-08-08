import { getJSGraph } from './jsgraph/getJSGraph.js';
import { getNormalizationAnnotations } from './jsgraph/getNormalizationAnnotations.js';

export * from './AnalysesManager.js';
export * from './Analysis.js';
export * from './from/fromJcamp.js';
export * from './from/fromText.js';
export * from './to/toJcamp.js';
export * from './to/toJcamps.js';
export * from './to/toText.js';
export * from './to/toMatrix.js';
export * from './util/getNormalizedSpectrum.js';

export * from './util/peakPicking.js';
export * from './util/autoPeakPicking.js';

export * from './types/types.js';
export * from './types/AutoPeakPickingOptions.js';
export * from './types/PeakPickingOptions.js';
export * from './types/NormalizedSpectrumOptions.js';
export type { MeasurementVariable, MeasurementXY } from 'cheminfo-types';
export * from './types/PlotObject.js';
export type { Shape1D } from 'ml-peak-shape-generator';
export * from './types/SpectrumSelector.js';

export { getReactPlotJSON } from './reactPlot/getReactPlotJSON.js';

export const JSGraph = {
  getJSGraph,
  getNormalizationAnnotations,
};
