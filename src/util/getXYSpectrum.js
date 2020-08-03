import { convertUnit } from './convertUnit';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve a spectrum with only X/Y data based on xUnits / yUnits and convert units
 * if necessary
 * @param {Array} [spectra] Array of spectra
 * @param {object} [selector={}]
 * @param {string} [selector.xUnits]
 * @param {string} [selector.yUnits]
 * @returns {Spectrum}
 */

export function getXYSpectrum(spectra = [], selector = {}) {
  if (spectra.length < 1) return;
  for (let spectrum of spectra) {
    let { xUnits, yUnits } = selector;
    let x;
    let y;
    let variableNames = Object.keys(spectrum.variables);
    if (!variableNames.length > 1) continue;

    if (xUnits === undefined) {
      x = spectrum.variables[variableNames[0]];
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
      y = spectrum.variables[variableNames[1]];
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
      return {
        title: spectrum.title,
        dataType: spectrum.dataType,
        meta: spectrum.meta,
        variables: { x, y },
      };
    }
  }
  return;
}
