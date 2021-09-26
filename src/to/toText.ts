import { Spectrum } from 'cheminfo-types/src/index';

import { Analysis } from '../Analysis';
import { SpectrumSelector } from '../types/SpectrumSelector';

interface ToTextOptions {
  selector?: SpectrumSelector;
  endOfLine?: string;
  fieldSeparator?: string;
}

export function toText(analysis: Analysis, options: ToTextOptions = {}) {
  // Export all the data to Csv
  if (!options.selector) {
    return exportText(analysis.spectra, options);
  }

  // Export selected variables
  const spectra = analysis.getXYSpectrum(options.selector);
  return exportText(spectra ? [spectra] : [], options);
}

function exportText(spectrums: Spectrum[], options: ToTextOptions) {
  const { endOfLine = '\n', fieldSeparator = ',' } = options;
  let result: string[] = new Array(spectrums.length);
  for (let index = 0; index < spectrums.length; index++) {
    const variables = Object.values(spectrums[index].variables);

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
