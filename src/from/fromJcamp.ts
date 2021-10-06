import { MeasurementVariable } from 'cheminfo-types';
import { convert } from 'jcampconverter';

import { Analysis } from '../Analysis';

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
  let analysis = new Analysis(options);
  addJcamp(analysis, jcamp);
  return analysis;
}

function addJcamp(analysis: Analysis, jcamp: string | ArrayBuffer) {
  let converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
  });

  for (let entry of converted.flatten) {
    if (!entry.spectra || !entry.spectra[0]) continue;
    let currentSpectrum = entry.spectra[0];

    // we ensure variables
    if (!currentSpectrum.variables) {
      const variables: Record<string, MeasurementVariable> = {};
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
      for (let key in currentSpectrum.variables) {
        const variable = currentSpectrum.variables[key];
        if (variable.label) continue;
        variable.label = variable.name || variable.symbol || key;
        if (variable.units && !variable.label.includes(variable.units)) {
          variable.label += ` [${variable.units}]`;
        }
      }
    }

    // todo hack waiting jcampconverter update
    for (let symbol in currentSpectrum.variables) {
      const variable = currentSpectrum.variables[symbol];
      if (variable?.type?.toUpperCase() === 'DEPENDENT') {
        delete variable.type;
        variable.isDependent = true;
      }
      if (variable?.type?.toUpperCase() === 'INDEPENDENT') {
        delete variable.type;
        variable.isDependent = false;
      }
      delete variable.name;
    }

    analysis.pushSpectrum(currentSpectrum.variables, {
      dataType: entry.dataType,
      description: entry.description || entry.title, // todo hack waiting for jcampconverter update
      meta: entry.meta,
    });
  }
}
