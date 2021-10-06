import { MeasurementVariable } from 'cheminfo-types';
import { convert } from 'jcampconverter';

import { Analysis } from '../Analysis';

/**
 * Creates a new Analysis from a JCAMP string
 * @param {string} jcamp - String containing the JCAMP data
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @param {string} [options.label=options.id] human redeable label
 * @param {string} [options.measurementCallback] a callback to apply on variables when creating measurement
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
    let currentMeasurement = entry.spectra[0];

    // we ensure variables
    if (!currentMeasurement.variables) {
      const variables: Record<string, MeasurementVariable> = {};
      currentMeasurement.variables = variables;
      variables.x = {
        label: currentMeasurement.xUnits,
        symbol: 'X',
        data: currentMeasurement.data.x || currentMeasurement.data.X,
      };
      variables.y = {
        label: currentMeasurement.yUnits,
        symbol: 'Y',
        data: currentMeasurement.data.y || currentMeasurement.data.Y,
      };
    } else {
      for (let key in currentMeasurement.variables) {
        const variable = currentMeasurement.variables[key];
        if (variable.label) continue;
        variable.label = variable.name || variable.symbol || key;
        if (variable.units && !variable.label.includes(variable.units)) {
          variable.label += ` [${variable.units}]`;
        }
      }
    }

    // todo hack waiting jcampconverter update
    for (let symbol in currentMeasurement.variables) {
      const variable = currentMeasurement.variables[symbol];
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

    analysis.pushMeasurement(currentMeasurement.variables, {
      dataType: entry.dataType,
      description: entry.description || entry.title, // todo hack waiting for jcampconverter update
      meta: entry.meta,
    });
  }
}
