import { convert } from 'jcampconverter';

import { Analysis } from '../Analysis';
import { SpectrumVariable } from '../types/Cheminfo';

/**
 * Creates a new Analysis from a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @param {string} [options.label=options.id] human redeable label
 * @param {string} [options.spectrumCallback] a callback to apply on variables when creating spectrum
 * @return {Analysis} - New class element with the given data
 */
export function fromJcamp(jcamp: string | ArrayBuffer, options = {}): Analysis {
  const analysis = new Analysis(options);
  addJcamp(analysis, jcamp);
  return analysis;
}

function addJcamp(analysis: Analysis, jcamp: string | ArrayBuffer) {
  const converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
  });

  for (const entry of converted.flatten) {
    if (!entry.spectra?.[0]) continue;
    const currentSpectrum = entry.spectra[0];

    // we ensure variables
    if (!currentSpectrum.variables) {
      const variables: Record<string, SpectrumVariable> = {};
      currentSpectrum.variables = variables;
      variables.x = {
        label: currentSpectrum.xUnits,
        symbol: 'X',
        data: currentSpectrum.data.x || currentSpectrum.data.X,
      };
      variables.y = {
        label: currentSpectrum.yUnits,
        symbol: 'Y',
        data: currentSpectrum.data.y || currentSpectrum.data.Y,
      };
    } else {
      for (const key in currentSpectrum.variables) {
        const variable = currentSpectrum.variables[key];
        if (variable.label) continue;
        variable.label = variable.name || variable.symbol || key;
        if (variable.units && !variable.label.includes(variable.units)) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          variable.label += ` [${variable.units}]`;
        }
      }
    }

    analysis.pushSpectrum(currentSpectrum.variables, {
      dataType: entry.dataType,
      title: entry.title,
      meta: entry.meta,
    });
  }
}
