import { convertUnit } from './convertUnit';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve a spectrum with only X/Y data based on xUnits / yUnits and convert units
 * if necessary
 * @param {Array} [spectra] Array of spectra
 * @param {object} [selector={}]
 * @param {string} [selector.units] Units separated by "vs", e.g., "g vs °C"
 * @param {string} [selector.xUnits]
 * @param {string} [selector.yUnits]
 * @param {string} [selector.labels] Labels separated by "vs", e.g., "relative pressure vs excess adsorption"
 * @param {string} [selector.xLabel]
 * @param {string} [selector.yLabel]
 * @returns {Spectrum}
 */

export function getXYSpectrum(spectra = [], selector = {}) {
  if (spectra.length < 1) return;
  for (let spectrum of spectra) {
    let x;
    let y;
    let variableNames = Object.keys(spectrum.variables);
    if (!variableNames.length > 1) continue;

    let { xUnits, yUnits, units, labels, xLabel, yLabel } = selector;
    if (units && !xUnits && !yUnits) [yUnits, xUnits] = units.split(/\s+vs\s+/);
    if (labels && !xLabel && !yLabel) {
      [xLabel, yLabel] = labels.split(/\s+vs\s+/);
    }
    if (xUnits !== undefined) {
      for (let key in spectrum.variables) {
        let converted = convertUnit(1, spectrum.variables[key].units, xUnits);
        if (converted) {
          x = getConvertedVariable(spectrum.variables[key], xUnits);
          break;
        }
      }
    } else if (xLabel in spectrum.variables) {
      x = spectrum.variables[xLabel];
    } else {
      x = spectrum.variables[variableNames[0]];
    }

    if (yUnits !== undefined) {
      for (let key in spectrum.variables) {
        let converted = convertUnit(1, spectrum.variables[key].units, yUnits);
        if (converted) {
          y = getConvertedVariable(spectrum.variables[key], yUnits);
          break;
        }
      }
    } else if (yLabel in spectrum.variables) {
      y = spectrum.variables[yLabel];
    } else {
      y = spectrum.variables[variableNames[1]];
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
