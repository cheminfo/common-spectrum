import { convert } from 'jcampconverter';

import { Analysis } from '../Analysis';

/**
 * Creates a new Analysis from a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @param {string} [options.label=options.id] human redeable label
 * @return {Analysis} - New class element with the given data
 */
export function fromJcamp(jcamp, options = {}) {
  let analysis = new Analysis(options);
  addJcamp(analysis, jcamp, options);
  return analysis;
}

function addJcamp(analysis, jcamp) {
  let converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
  });

  for (let entry of converted.flatten) {
    let currentSpectrum = entry.spectra[0];

    // we ensure variables
    if (!currentSpectrum.variables) {
      const variables = {};
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

    analysis.pushSpectrum(currentSpectrum.variables, {
      dataType: entry.dataType,
      title: entry.title,
      meta: entry.meta,
    });
  }
}
