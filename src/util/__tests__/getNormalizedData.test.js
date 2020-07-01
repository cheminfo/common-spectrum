import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { getNormalizedData } from '../getNormalizedData';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const spectrum = {
  variables: {
    x: {
      data: [1, 2],
    },
    y: {
      data: [2, 3],
    },
  },
};

describe('getNormalizedData', () => {
  it('no filter', () => {
    let normalized = getNormalizedData(spectrum, {});
    expect(normalized.y).toStrictEqual([2, 3]);
  });
  it('normalize', () => {
    let normalized = getNormalizedData(spectrum, {
      filters: [{ name: 'normalize' }],
    });
    expect(normalized.y).toStrictEqual([0.4, 0.6]);
  });
  it('divideByMax', () => {
    let normalized = getNormalizedData(spectrum, {
      filters: [{ name: 'divideByMax' }],
    });
    expect(normalized.y).toBeDeepCloseTo([0.66666, 1], 4);
  });
  it('add', () => {
    let normalized = getNormalizedData(spectrum, {
      filters: [{ name: 'add', options: { value: 1 } }],
    });
    expect(normalized.y).toStrictEqual([3, 4]);
  });
  it('multiply', () => {
    let normalized = getNormalizedData(spectrum, {
      filters: [{ name: 'multiply', options: { value: 100 } }],
    });
    expect(normalized.y).toStrictEqual([200, 300]);
  });
  it('dividebysd', () => {
    let normalized = getNormalizedData(spectrum, {
      filters: [{ name: 'dividebysd' }],
    });
    expect(normalized.y).toBeDeepCloseTo(
      [2.82842712474619, 4.242640687119285],
      4,
    );
  });
  it('centermean', () => {
    let normalized = getNormalizedData(spectrum, {
      filters: [{ name: 'centermean' }],
    });
    expect(normalized.y).toBeDeepCloseTo([-0.5, 0.5], 4);
  });
  it('rescale', () => {
    let normalized = getNormalizedData(spectrum, {
      filters: [{ name: 'rescale', options: { min: 100, max: 200 } }],
    });
    expect(normalized.y).toStrictEqual([100, 200]);
  });
});
