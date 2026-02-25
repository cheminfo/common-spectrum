import type { MeasurementXY } from 'cheminfo-types';
import { fromVariables } from 'convert-to-jcamp';

import type { Analysis } from '../Analysis.js';

export interface GetJcampOptions {
  /** Additional info fields to include in the JCAMP header. */
  info?: Record<string, string>;
  /** Additional meta fields to include in the JCAMP. */
  meta?: Record<string, string>;
}
export function toJcamps(analysis: Analysis, options: GetJcampOptions = {}) {
  const jcamps = [];
  for (const spectrum of analysis.spectra) {
    jcamps.push(getJcamp(spectrum, options));
  }
  return jcamps;
}

function getJcamp(spectrum: MeasurementXY, options: GetJcampOptions) {
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
