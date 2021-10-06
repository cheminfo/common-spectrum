import type { MeasurementXY } from 'cheminfo-types';

import { Analysis } from '../Analysis';
import { MeasurementSelector } from '../types/MeasurementSelector';

interface ToTextOptions {
  selector?: MeasurementSelector;
  endOfLine?: string;
  fieldSeparator?: string;
}

export function toText(analysis: Analysis, options: ToTextOptions = {}) {
  // Export all the data to Csv
  if (!options.selector) {
    return exportText(analysis.measurements, options);
  }

  // Export selected variables
  const measurements = analysis.getMeasurementXY(options.selector);
  return exportText(measurements ? [measurements] : [], options);
}

function exportText(measurements: MeasurementXY[], options: ToTextOptions) {
  const { endOfLine = '\n', fieldSeparator = ',' } = options;
  let result: string[] = new Array(measurements.length);
  for (let index = 0; index < measurements.length; index++) {
    const variables = Object.values(measurements[index].variables);

    const labels = variables.map((v) => v.label);
    const maxNumberData = Math.max(...variables.map((v) => v.data.length));

    let lines = [labels.join(fieldSeparator)];
    for (let lineIndex = 0; lineIndex < maxNumberData; lineIndex++) {
      lines.push(
        variables
          .map(({ data }) =>
            data[lineIndex] === undefined ? '' : data[lineIndex],
          )
          .join(fieldSeparator),
      );
    }

    result[index] = lines.join(endOfLine);
  }
  return result;
}
