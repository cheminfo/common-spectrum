import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { getNormalizedMeasurement } from '../getNormalizedMeasurement';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

let measurement = {
  variables: {
    x: {
      data: [1, 2],
      units: 's',
      label: 'X axis [s]',
    },
    y: {
      data: [2, 3],
      units: '°C',
      label: 'Y axis [°C]',
    },
  },
};

describe('getNormalizedMeasurement', () => {
  it('no filter', () => {
    let normalized = getNormalizedMeasurement(measurement, {});
    expect(normalized).toStrictEqual({
      variables: {
        x: {
          data: [1, 2],
          min: 1,
          max: 2,
          isMonotone: true,
          label: 'X axis [s]',
          units: 's',
        },
        y: {
          data: [2, 3],
          min: 2,
          max: 3,
          isMonotone: true,
          label: 'Y axis [°C]',
          units: '°C',
        },
      },
    });
  });
  it('normalize', () => {
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'normalize' }],
    });
    expect(normalized).toStrictEqual({
      variables: {
        x: {
          data: [1, 2],
          units: 's',
          label: 'X axis [s]',
          min: 1,
          max: 2,
          isMonotone: true,
        },
        y: {
          data: [0.4, 0.6],
          units: '',
          label: 'Y axis',
          min: 0.4,
          max: 0.6,
          isMonotone: true,
        },
      },
    });
  });
  it('divideByMax', () => {
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'divideByMax' }],
    });
    expect(normalized.variables.y.data).toBeDeepCloseTo([0.66666, 1], 4);
  });
  it('add', () => {
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'add', options: { value: 1 } }],
    });
    expect(normalized.variables.y.data).toStrictEqual([3, 4]);
  });
  it('multiply', () => {
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'multiply', options: { value: 100 } }],
    });
    expect(Array.from(normalized.variables.y.data)).toStrictEqual([200, 300]);
  });
  it('dividebysd', () => {
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'divideBySD' }],
    });
    expect(normalized.variables.y.data).toBeDeepCloseTo(
      [2.82842712474619, 4.242640687119285],
      4,
    );
  });
  it('centermean', () => {
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'centerMean' }],
    });
    expect(normalized.variables.y.data).toBeDeepCloseTo([-0.5, 0.5], 4);
  });
  it('rescale', () => {
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'rescale', options: { min: 100, max: 200 } }],
    });
    expect(normalized.variables.y.data).toStrictEqual([100, 200]);
  });
  it('ensureGrowing', () => {
    let measurement = {
      variables: {
        x: {
          data: [100, 200, 1, 2, 300],
          units: 's',
          label: 'X axis [s]',
        },
        y: {
          data: [1, 2, 3, 4, 5],
          units: '°C',
          label: 'Y axis [°C]',
        },
      },
    };
    let normalized = getNormalizedMeasurement(measurement, {
      filters: [{ name: 'ensureGrowing' }],
    });
    expect(normalized.variables.y.data).toStrictEqual([1, 2, 5]);
    expect(normalized.variables.x.data).toStrictEqual([100, 200, 300]);
  });
});
