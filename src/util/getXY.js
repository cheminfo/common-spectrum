import { convertUnit } from './convertUnit';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve X/Y based on xUnits / yUnits and convert units
 * if necessary
 * @param {Array} [spectra] Array of spectra
 * @param {object} [selector={}]
 * @param {string} [selector.xUnits]
 * @param {string} [selector.yUnits]
 * @returns {Spectrum}
 */

export function getXY(spectra = [], selector = {}) {
  if (spectra.length < 1) return;
  for (let spectrum of spectra) {
    let { xUnits, yUnits } = selector;
    let x = undefined;
    let y = undefined;
    let variablesNames = Object.keys(spectrum.variables);
    if (!variablesNames.length > 1) continue;

    if (xUnits === undefined) {
      x = spectrum.variables[variablesNames[0]];
    } else {
      for (let key in spectrum.variables) {
        let converted = convertUnit(1, spectrum.variables[key].units, xUnits);
        if (converted) {
          x = getConvertedVariable(spectrum.variables[key], xUnits);
          break;
        }
      }
    }
    if (yUnits === undefined) {
      x = spectrum.variables[variablesNames[1]];
    } else {
      for (let key in spectrum.variables) {
        let converted = convertUnit(1, spectrum.variables[key].units, yUnits);
        if (converted) {
          y = getConvertedVariable(spectrum.variables[key], yUnits);
          break;
        }
      }
    }
    if (x && y) {
      return { x, y };
    }
  }
  return;
}
