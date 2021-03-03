import { Analysis } from '../Analysis';
import type { SelectorType, SpectrumType } from '../types';

interface ToTextOptions {
  selector?: SelectorType;
  endOfLine?: string;
  fieldSeparator?: string;
}

export function toText(analysis: Analysis, options: ToTextOptions = {}) {
  // Export all the data to Csv
  if (!options.selector) {
    return exportCSV(analysis.spectra, options);
  }

  // Export selected variables
  const spectrums = analysis.getXYSpectrum(options.selector);
  return exportCSV(spectrums ? [spectrums] : [], options);
}

function exportCSV(spectrums: SpectrumType[], options: ToTextOptions) {
  const { endOfLine = '\n', fieldSeparator = ',' } = options;
  let res: string[] = new Array(spectrums.length);
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

    res[index] = lines.join(endOfLine);
  }
  return res;
}
