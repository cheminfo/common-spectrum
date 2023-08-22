import { fromVariables } from 'convert-to-jcamp';

import { Analysis } from '../Analysis';
import type { Spectrum } from '../types/Cheminfo';

interface GetJcampOptions {
  info?: Record<string, string>;
  meta?: Record<string, string>;
}
export function toJcamps(analysis: Analysis, options: GetJcampOptions = {}) {
  const jcamps = [];
  for (const spectrum of analysis.spectra) {
    jcamps.push(getJcamp(spectrum, options));
  }
  return jcamps;
}

function getJcamp(spectrum: Spectrum, options: GetJcampOptions) {
  const { info = {}, meta = {} } = options;

  const jcampOptions = {
    options: {},
    info: {
      title: spectrum.title,
      dataType: spectrum.dataType,
      ...info,
    },
    meta: { ...spectrum.meta, ...meta },
  };

  return fromVariables(spectrum.variables, jcampOptions);
}
