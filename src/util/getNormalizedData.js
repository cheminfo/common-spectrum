import max from 'ml-array-max';
import normed from 'ml-array-normed';
import rescale from 'ml-array-rescale';
import equallySpaced from 'ml-array-xy-equally-spaced';
import filterX from 'ml-array-xy-filter-x';
import savitzkyGolay from 'ml-savitzky-golay';
import { xDivide, xSubtract, xMultiply, xAdd } from 'ml-spectra-processing';
import Stat from 'ml-stat/array';
/**
 *
 * @private
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.from=spectrum.x[0]]
 * @param {number} [options.to=spectrum.x[spectrum.x.length-1]]
 * @param {number} [options.numberOfPoints]
 * @param {Array} [options.filters=[]] Array of object containing 'name' (centerMean, divideSD, normalize, rescale) and 'options'
 * @param {Array} [options.exclusions=[]]
 * @returns {DataXY}
 */
export function getNormalizedData(spectrum, options = {}) {
  let data = {
    x: spectrum.variables.x.data,
    y: spectrum.variables.y.data,
  };

  let {
    from = data.x[0],
    to = data.x[data.x.length - 1],
    numberOfPoints,
    filters = [],
    exclusions = [],
    processing = '',
  } = options;

  let { x, y } = filterX(data, { from, to });

  switch (processing) {
    case 'firstDerivative':
      if (options.processing) {
        y = savitzkyGolay(y, 1, {
          derivative: 1,
          polynomial: 2,
          windowSize: 5,
        });
        x = x.slice(2, x.length - 2);
      }
      break;
    case 'secondDerivative':
      if (options.processing) {
        y = savitzkyGolay(y, 1, {
          derivative: 2,
          polynomial: 2,
          windowSize: 5,
        });
        x = x.slice(2, x.length - 2);
      }
      break;
    default:
  }

  for (let filter of filters) {
    let filterOptions = filter.options || {};
    switch (filter.name.toLowerCase()) {
      case 'centermean': {
        let mean = Stat.mean(y);
        y = xSubtract(y, mean);
        break;
      }
      case 'dividebysd': {
        let std = Stat.standardDeviation(y);
        y = xDivide(y, std);
        break;
      }
      case 'normalize': {
        y = normed(y, {
          sumValue: filterOptions.value ? Number(filterOptions.value) : 1,
          algorithm: 'absolute',
        });
        break;
      }
      case 'rescale': {
        y = rescale(y, {
          min: filterOptions.min ? Number(filterOptions.min) : 0,
          max: filterOptions.max ? Number(filterOptions.max) : 1,
        });
        break;
      }
      case 'dividebymax': {
        let maxValue = max(y);
        y = xDivide(y, maxValue);
        break;
      }
      case 'multiply': {
        y = xMultiply(y, filterOptions.value ? Number(filterOptions.value) : 1);
        break;
      }
      case 'add': {
        y = xAdd(y, filterOptions.value ? Number(filterOptions.value) : 0);
        break;
      }
      case '':
      case undefined:
        break;
      default:
        throw new Error(`Unknown process kind: ${process.kind}`);
    }
  }

  if (!numberOfPoints) {
    return filterX({ x, y }, { from, to, exclusions });
  }

  return equallySpaced({ x, y }, { from, to, numberOfPoints, exclusions });
}
