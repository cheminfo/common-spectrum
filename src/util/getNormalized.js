import normed from 'ml-array-normed';
import rescale from 'ml-array-rescale';
import equallySpaced from 'ml-array-xy-equally-spaced';
import filterX from 'ml-array-xy-filter-x';
import savitzkyGolay from 'ml-savitzky-golay';
import { xDivide, xSubtract } from 'ml-spectra-processing';
import Stat from 'ml-stat/array';
/**
 *
 * @private
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.from=spectrum.x[0]]
 * @param {number} [options.to=spectrum.x[spectrum.x.length-1]]
 * @param {number} [options.numberOfPoints]
 * @param {Array} [options.filters=[]]
 * @param {Array} [options.exclusions=[]]
 */
export default function getNormalized(spectrum, options = {}) {
  let {
    from = spectrum.x[0],
    to = spectrum.x[spectrum.x.length - 1],
    numberOfPoints,
    filters = [],
    exclusions = [],
    processing = '',
  } = options;

  let { x, y } = filterX(spectrum, { from, to });

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
    switch (filter.name) {
      case 'centerMean': {
        let mean = Stat.mean(y);
        y = xSubtract(mean);
        break;
      }
      case 'scaleSD': {
        let std = Stat.standardDeviation(y);
        y = xDivide(std);
        break;
      }
      case 'normalize': {
        // should be an integration in fact
        y = normed(y, {
          sumValue: filterOptions.value ? Number(filterOptions.value) : 1,
          algorithm: 'absolute',
        });
        break;
      }
      case 'rescale': {
        y = rescale(y, {
          min: filterOptions.min ? Number(filter.options.min) : 0,
          max: filterOptions.max ? Number(filter.options.max) : 1,
        });
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
