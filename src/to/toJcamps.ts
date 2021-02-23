import { fromVariables } from 'convert-to-jcamp';
import { Analysis } from '../Analysis';
import { SpectrumType } from '../types';

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

function getJcamp(spectrum: SpectrumType, options: GetJcampOptions) {
  const { info = {}, meta = {} } = options;

  let jcampOptions = {
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
