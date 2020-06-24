import { fromVariables } from 'convert-to-jcamp';

export function toJcamp(analysis, options = {}) {
  let jcamps = [];
  for (let spectrum of analysis.spectra) {
    jcamps.push(getJcamp(spectrum, options));
  }
  return jcamps.join('\n');
}

function getJcamp(spectrum, options) {
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
