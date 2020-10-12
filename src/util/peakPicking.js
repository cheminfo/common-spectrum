import { gsd } from 'ml-gsd';

/**
 * Retrieve a spectrum with only X/Y data based on xUnits / yUnits and convert units
 * if necessary
 * @param {object} [data] Object {x:[], y:[]}
 * @param {object} [options={}]
 * @param {object} [options.sgOptions={}] - Options object for Savitzky-Golay filter. See https://github.com/mljs/savitzky-golay-generalized#options
 * @param {number} [options.sgOptions.windowSize = 9] - points to use in the approximations
 * @param {number} [options.sgOptions.polynomial = 3] - degree of the polynomial to use in the approximations
 *
 * @returns {Array<object>}
 */

export function peakPicking(data, options = {}) {
  let peaks = gsd(data.x, data.y, options);
  return peaks;
}
