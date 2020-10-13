import { convertUnit } from './convertUnit';
import { ensureRegexp } from './ensureRegexp';
import { getConvertedVariable } from './getConvertedVariable';
/**
 * Retrieve the first spectrum with only X/Y data that match all the selectors
 * @param {Array} [spectra] Array of spectra
 * @param {object} [selector={}]
 * @param {string} [selector.units] Units separated by "vs", e.g., "g vs °C"
 * @param {string} [selector.xUnits]
 * @param {string} [selector.yUnits]
 * @param {string} [selector.labels] Labels separated by "vs", e.g., "relative pressure vs excess adsorption"
 * @param {string} [selector.xLabel] will be converted to case insensitive regexp
 * @param {string} [selector.yLabel] will be converted to case insensitive regexp
 * @param {string} [selector.dataType] will be converted to case insensitive regexp
 * @returns {Spectrum}
 */

export function getXYSpectrum(spectra = [], selector = {}) {
  if (spectra.length < 1) return;

  for (let spectrum of spectra) {
    let variableNames = Object.keys(spectrum.variables);
    if (!variableNames.length > 1) continue;
    let { dataType, xUnits, yUnits, units, labels, xLabel, yLabel } = selector;

    // we filter on generatl spectrum information
    if (dataType) {
      dataType = ensureRegexp(dataType);
      if (!spectrum.dataType || !spectrum.dataType.match(dataType)) continue;
    }


    let x;
    let y;

    if (units && !xUnits && !yUnits) [yUnits, xUnits] = units.split(/\s+vs\s+/);
    if (labels && !xLabel && !yLabel) {
      [xLabel, yLabel] = labels.split(/\s+vs\s+/);
    }

    if (xLabel) xLabel = ensureRegexp(xLabel);
    if (yLabel) yLabel = ensureRegexp(yLabel);

    if (xUnits !== undefined) {
      for (let key in spectrum.variables) {
        let converted = convertUnit(1, spectrum.variables[key].units, xUnits);
        if (converted) {
          x = getConvertedVariable(spectrum.variables[key], xUnits);
          break;
        }
      }
    } else if (xLabel !== undefined) {
      for (let key in spectrum.variables) {
        if (spectrum.variables[key].label.match(xLabel)) {
          x = spectrum.variables[key];
          break;
        }
      }
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
    } else if (yLabel !== undefined) {
      for (let key in spectrum.variables) {
        if (spectrum.variables[key].label.match(yLabel)) {
          y = spectrum.variables[key];
          break;
        }
      }
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
