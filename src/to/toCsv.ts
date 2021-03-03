import { Analysis } from '../Analysis';
import type { SelectorType, SpectrumType } from '../types';

export function toCsv(analysis: Analysis, options?: SelectorType) {
  // Export all the data to Csv
  if (!options) {
    return exportCSV(analysis.spectra);
  }

  // Export selected variables
  const spectrums = analysis.getXYSpectrum(options);
  return exportCSV(spectrums ? [spectrums] : []);
}

function exportCSV(spectrums: SpectrumType[]) {
  let res: string[] = new Array(spectrums.length);
  for (let index = 0; index < spectrums.length; index++) {
    const variables = Object.values(spectrums[index].variables);

    const labels = variables.map((v) => v.label);
    const maxNumberData = Math.max(...variables.map((v) => v.data.length));

    let lines = [labels.join(',')];
    for (let lineIndex = 0; lineIndex < maxNumberData; lineIndex++) {
      lines.push(
        variables
          .map(({ data }) =>
            data[lineIndex] === undefined ? '' : data[lineIndex],
          )
          .join(','),
      );
    }

    res[index] = lines.join('\n');
  }
  return res;
}
