import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { describe, it, expect } from 'vitest';

import { getNormalizedSpectrum } from '../getNormalizedSpectrum';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const spectrum = {
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

describe('getNormalizedSpectrum', () => {
  it('no filter', () => {
    const normalized = getNormalizedSpectrum(spectrum, {});
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
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'normed' }],
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
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'normed', options: { algorithm: 'max', value: 1 } }],
    });
    expect(normalized.variables.y.data).toBeDeepCloseTo([0.66666, 1], 4);
  });

  it('dividebysd', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'divideBySD' }],
    });
    expect(normalized.variables.y.data).toBeDeepCloseTo(
      [2.82842712474619, 4.242640687119285],
      4,
    );
  });
  it('centermean', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'centerMean' }],
    });
    expect(normalized.variables.y.data).toBeDeepCloseTo([-0.5, 0.5], 4);
  });
  it('rescale', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'rescale', options: { min: 100, max: 200 } }],
    });
    expect(normalized.variables.y.data).toStrictEqual([100, 200]);
  });
  it('ensureGrowing', () => {
    const spectrum = {
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
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'ensureGrowing' }],
    });
    expect(normalized.variables.y.data).toStrictEqual([1, 2, 5]);
    expect(normalized.variables.x.data).toStrictEqual([100, 200, 300]);
  });
});
