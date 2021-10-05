import type { MeasurementXY } from 'cheminfo-types';
import { fromVariables } from 'convert-to-jcamp';

import { Analysis } from '../Analysis';

interface GetJcampOptions {
  info?: Record<string, string>;
  meta?: Record<string, string>;
}
export function toJcamps(analysis: Analysis, options: GetJcampOptions = {}) {
  let jcamps = [];
  for (let spectrum of analysis.spectra) {
    jcamps.push(getJcamp(spectrum, options));
  }
  return jcamps;
}

function getJcamp(spectrum: MeasurementXY, options: GetJcampOptions) {
  const { info = {}, meta = {} } = options;

  let jcampOptions = {
    options: {},
    info: {
      description: spectrum.description,
      dataType: spectrum.dataType,
      ...info,
    },
    meta: { ...spectrum.meta, ...meta },
  };

  return fromVariables(spectrum.variables, jcampOptions);
}
