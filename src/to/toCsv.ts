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

    const columns = variables.reduce(
      (acc: { max: number; variables: string[] }, curr) => {
        const max = Math.max(acc.max, curr.data.length);
        const variables = [...acc.variables, curr.label];
        return { max, variables };
      },
      { max: 0, variables: [] },
    );
    let lines = [columns.variables.join(',')];
    for (let lineIndex = 0; lineIndex < columns.max; lineIndex++) {
      lines.push(
        variables
          .map(({ data }) => {
            const value = data[lineIndex];
            return value === undefined ? '' : value;
          })
          .join(','),
      );
    }

    res[index] = lines.join('\n');
  }
  return res;
}
