import type { MeasurementXY } from 'cheminfo-types';
import { fromVariables } from 'convert-to-jcamp';

import { Analysis } from '../Analysis';

interface GetJcampOptions {
  info?: Record<string, string>;
  meta?: Record<string, string>;
}
export function toJcamps(analysis: Analysis, options: GetJcampOptions = {}) {
  let jcamps = [];
  for (let measurement of analysis.measurements) {
    jcamps.push(getJcamp(measurement, options));
  }
  return jcamps;
}

function getJcamp(measurement: MeasurementXY, options: GetJcampOptions) {
  const { info = {}, meta = {} } = options;

  let jcampOptions = {
    options: {},
    info: {
      title: measurement.description,
      dataType: measurement.dataType,
      ...info,
    },
    meta: { ...measurement.meta, ...meta },
  };

  return fromVariables(measurement.variables, jcampOptions);
}
