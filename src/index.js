import { SpectraManager } from './SpectraManager';
import { Spectrum } from './Spectrum';
import { fromJcamp } from './from/fromJcamp';
import { getJSGraph } from './jsgraph/getJSGraph';
import { toJcamp } from './to/toJcamp';

export function CommonSpectrum(options = {}) {
  const { dataType = '' } = options;
  return {
    Spectrum,
    SpectraManager,
    fromJcamp,
    toJcamp: (jcamp) => toJcamp(jcamp, { dataType }),
    getJSGraph,
  };
}
