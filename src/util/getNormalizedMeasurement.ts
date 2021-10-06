import {
  airPLSBaseline,
  rollingAverageBaseline,
  iterativePolynomialBaseline,
  rollingBallBaseline,
  rollingMedianBaseline,
} from 'baselines';
import type { MeasurementXY } from 'cheminfo-types';
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
  xyEnsureGrowingX,
} from 'ml-spectra-processing';
import Stat from 'ml-stat/array';

import { MeasurementNormalizationOptions } from '../types/MeasurementNormalizationOptions';

export function getNormalizedMeasurement(
  measurement: MeasurementXY,
  options: MeasurementNormalizationOptions = {},
): MeasurementXY {
  let data = {
    x: measurement.variables.x.data,
    y: measurement.variables.y.data,
  };
  let newMeasurement: MeasurementXY = {
    variables: {
      x: {
        data: measurement.variables.x.data,
        units: measurement.variables.x.units,
        label: measurement.variables.x.label,
      },
      y: {
        data: measurement.variables.y.data,
        units: measurement.variables.y.units,
        label: measurement.variables.y.label,
      },
    },
  };
  if (measurement.description) {
    newMeasurement.description = measurement.description;
  }
  if (measurement.meta) newMeasurement.meta = measurement.meta;

  let {
    from = measurement.variables.x.min,
    to = measurement.variables.x.max,
    numberOfPoints,
    filters = [],
    exclusions = [],
    processing = '',
    keepYUnits = false,
  } = options;
  let { x, y } = filterX(data, { from, to });

  switch (processing) {
    case 'firstDerivative':
      if (options.processing) {
        newMeasurement.variables.y.units = '';
        newMeasurement.variables.y.label =
          newMeasurement.variables.y.label &&
          `1st derivative of ${newMeasurement.variables.y.label.replace(
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
        newMeasurement.variables.y.units = '';
        newMeasurement.variables.y.label =
          newMeasurement.variables.y.label &&
          `2nd derivative of ${newMeasurement.variables.y.label.replace(
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
    case 'thirdDerivative':
      if (options.processing) {
        newMeasurement.variables.y.units = '';
        newMeasurement.variables.y.label =
          newMeasurement.variables.y.label &&
          `3rd derivative of ${newMeasurement.variables.y.label.replace(
            /\s*\[.*\]/,
            '',
          )}`;
        y = savitzkyGolay(y, 1, {
          derivative: 3,
          polynomial: 2,
          windowSize: 5,
        });
        x = x.slice(2, x.length - 2);
      }
      break;
    default:
  }

  if (!keepYUnits && filters.length) {
    // filters change the y axis, we get rid of the units
    newMeasurement.variables.y.units = '';
    newMeasurement.variables.y.label =
      newMeasurement.variables.y.label?.replace(/\s*\[.*\]/, '');
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
      case 'airplsbaseline': {
        y = airPLSBaseline(y, filterOptions).correctedSpectrum;
        break;
      }
      case 'rollingaveragebaseline': {
        y = rollingAverageBaseline(y, filterOptions).correctedSpectrum;
        break;
      }
      case 'iterativepolynomialbaseline': {
        y = iterativePolynomialBaseline(
          y,
          undefined,
          filterOptions,
        ).correctedSpectrum;
        break;
      }
      case 'rollingballbaseline': {
        y = rollingBallBaseline(y, filterOptions).correctedSpectrum;
        break;
      }
      case 'rollingmedianbaseline': {
        y = rollingMedianBaseline(y, filterOptions).correctedSpectrum;
        break;
      }
      case 'ensuregrowing': {
        const ans = xyEnsureGrowingX({ x, y });
        x = ans.x;
        y = ans.y;
        break;
      }
      case '':
      case undefined:
        break;
      default:
        throw new Error(`Unknown process kind: ${filter.name}`);
    }
  }

  if (!numberOfPoints) {
    data = filterX({ x, y }, { from, to, exclusions });
  } else {
    data = equallySpaced({ x, y }, { from, to, numberOfPoints, exclusions });
  }

  newMeasurement.variables.x.data = x;
  newMeasurement.variables.x.min = min(x);
  newMeasurement.variables.x.max = max(x);
  newMeasurement.variables.x.isMonotone = xIsMonotone(x);
  newMeasurement.variables.y.data = y;
  newMeasurement.variables.y.min = min(y);
  newMeasurement.variables.y.max = max(y);
  newMeasurement.variables.y.isMonotone = xIsMonotone(y);

  return newMeasurement;
}
