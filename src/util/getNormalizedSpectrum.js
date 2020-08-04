import max from 'ml-array-max';
import min from 'ml-array-min';
import normed from 'ml-array-normed';
import rescale from 'ml-array-rescale';
import equallySpaced from 'ml-array-xy-equally-spaced';
import filterX from 'ml-array-xy-filter-x';
import savitzkyGolay from 'ml-savitzky-golay';
import {
  xDivide,
  xSubtract,
  xMultiply,
  xAdd,
  xIsMonotone,
} from 'ml-spectra-processing';
import Stat from 'ml-stat/array';
/**
 *
 * @private
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.from=x.min]
 * @param {number} [options.to=x.max]
 * @param {number} [options.numberOfPoints]
 * @param {String} [options.processing] Allows to calculate derivatives
 * @param {Array} [options.filters=[]] Array of object containing 'name' (centerMean, divideSD, normalize, rescale) and 'options'
 * @param {Array} [options.exclusions=[]]
 * @returns {DataXY}
 */
export function getNormalizedSpectrum(spectrum, options = {}) {
  let data = {
    x: spectrum.variables.x.data,
    y: spectrum.variables.y.data,
  };
  let newSpectrum = {
    variables: {
      x: {
        data: spectrum.variables.x.data,
        units: spectrum.variables.x.units,
        label: spectrum.variables.x.label,
      },
      y: {
        data: spectrum.variables.y.data,
        units: spectrum.variables.y.units,
        label: spectrum.variables.y.label,
      },
    },
  };
  if (spectrum.title) newSpectrum.title = spectrum.title;
  if (spectrum.dataType) newSpectrum.dataType = spectrum.dataType;
  if (spectrum.meta) newSpectrum.meta = spectrum.meta;

  let {
    from = spectrum.variables.x.min,
    to = spectrum.variables.x.max,
    numberOfPoints,
    filters = [],
    exclusions = [],
    processing = '',
  } = options;
  let { x, y } = filterX(data, { from, to });

  switch (processing) {
    case 'firstDerivative':
      if (options.processing) {
        newSpectrum.variables.y.units = '';
        newSpectrum.variables.y.label =
          newSpectrum.variables.y.label &&
          `1° derivative of${newSpectrum.variables.y.label.replace(
            /\s*\[.*\]/,
            '',
          )}`;
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
        newSpectrum.variables.y.units = '';
        newSpectrum.variables.y.label =
          newSpectrum.variables.y.label &&
          `2° derivative of${newSpectrum.variables.y.label.replace(
            /\s*\[.*\]/,
            '',
          )}`;
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

  if (filters.length) {
    // filters change the y axis, we get rid of the units
    newSpectrum.variables.y.units = '';
    newSpectrum.variables.y.label =
      newSpectrum.variables.y.label &&
      newSpectrum.variables.y.label.replace(/\s*\[.*\]/, '');
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
    data = filterX({ x, y }, { from, to, exclusions });
  } else {
    data = equallySpaced({ x, y }, { from, to, numberOfPoints, exclusions });
  }

  newSpectrum.variables.x.data = x;
  newSpectrum.variables.x.min = min(x);
  newSpectrum.variables.x.max = max(x);
  newSpectrum.variables.x.isMonotone = xIsMonotone(x);
  newSpectrum.variables.y.data = y;
  newSpectrum.variables.y.min = min(y);
  newSpectrum.variables.y.max = max(y);
  newSpectrum.variables.y.isMonotone = xIsMonotone(y);

  return newSpectrum;
}
