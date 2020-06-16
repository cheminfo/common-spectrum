import { fromJSON } from 'convert-to-jcamp';

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
    info: {
      xUnits: spectrum.xLabel.includes(spectrum.xUnits)
        ? spectrum.xLabel
        : `${spectrum.xLabel} [${spectrum.xUnits}]`,
      yUnits: spectrum.yLabel.includes(spectrum.yUnits)
        ? spectrum.yLabel
        : `${spectrum.yLabel} [${spectrum.yUnits}]`,
      title: spectrum.title,
      dataType: spectrum.dataType,
      ...info,
    },

    meta: { ...spectrum.meta, ...meta },
  };

  return fromJSON({ x: spectrum.x, y: spectrum.y }, jcampOptions);
}
