import { gsd } from 'ml-gsd';

/**
 * Calls global spectrum deconvolution to pick peaks
 * @param {object} [data] Object {x:[], y:[]}
 * @param {object} [options={}]
 * @param {object} [options.shape={}] - Object that specified the kind of shape to calculate the FWHM instead of width between inflection points. see https://mljs.github.io/peak-shape-generator/#inflectionpointswidthtofwhm
 * @param {object} [options.shape.kind='gaussian']
 * @param {object} [options.shape.options={}]
 * @param {object} [options.sgOptions] - Options object for Savitzky-Golay filter. See https://github.com/mljs/savitzky-golay-generalized#options
 * @param {number} [options.sgOptions.windowSize = 9] - points to use in the approximations
 * @param {number} [options.sgOptions.polynomial = 3] - degree of the polynomial to use in the approximations
 * @param {number} [options.minMaxRatio = 0.00025] - Threshold to determine if a given peak should be considered as a noise
 * @param {number} [options.broadRatio = 0.00] - If `broadRatio` is higher than 0, then all the peaks which second derivative
 * smaller than `broadRatio * maxAbsSecondDerivative` will be marked with the soft mask equal to true.
 * @param {number} [options.noiseLevel = 0] - Noise threshold in spectrum units
 * @param {boolean} [options.maxCriteria = true] - Peaks are local maximum(true) or minimum(false)
 * @param {boolean} [options.smoothY = true] - Select the peak intensities from a smoothed version of the independent variables
 * @param {boolean} [options.realTopDetection = false] - Use a quadratic optimizations with the peak and its 3 closest neighbors
 * to determine the true x,y values of the peak?
 * @param {number} [options.heightFactor = 0] - Factor to multiply the calculated height (usually 2)
 * @param {number} [options.derivativeThreshold = -1] - Filters based on the amplitude of the first derivative
 * @returns {Array<object>}
 */

export function peakPicking(data, options = {}) {
  let peaks = gsd(data, options);
  return peaks;
}
