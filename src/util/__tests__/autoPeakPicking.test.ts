import type { MeasurementXY } from 'cheminfo-types';
import { expect, test } from 'vitest';

import { autoPeakPicking } from '../autoPeakPicking.js';

const positiveSpectrum: MeasurementXY = {
  variables: {
    x: {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      label: 'x',
    },
    y: {
      data: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1],
      label: 'y',
    },
    z: {
      data: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6, 5, 4, 3, 2],
      label: 'z',
    },
  },
};

test('autoPeakPicking positive no options', () => {
  const peaks = autoPeakPicking(positiveSpectrum, {});

  expect(peaks).toStrictEqual([]);
});

test('autoPeakPicking positive noiseLevel: 0', () => {
  const peaks = autoPeakPicking(positiveSpectrum, { noiseLevel: 0 });

  expect(peaks).toStrictEqual([
    { x: 6, y: 6, z: 5, width: 6 },
    { x: 14, y: 6, z: 5, width: 6 },
  ]);
});

test('autoPeakPicking positive xVariable=x, yVariable=z', () => {
  const peaks = autoPeakPicking(positiveSpectrum, {
    xVariable: 'x',
    yVariable: 'z',
    noiseLevel: 0,
  });

  expect(peaks).toStrictEqual([{ x: 7, y: 5, z: 6, width: 5 }]);
});

test('autoPeakPicking positive minPeakWidth: 5', () => {
  const peaks = autoPeakPicking(positiveSpectrum, {
    noiseLevel: 0,
    minPeakWidth: 7,
  });

  expect(peaks).toStrictEqual([]);
});

test('autoPeakPicking positive xVariable=x, yVariable=z, from:2, to:18', () => {
  const peaks = autoPeakPicking(positiveSpectrum, {
    xVariable: 'x',
    yVariable: 'z',
    from: 2,
    to: 18,
    noiseLevel: 0,
  });

  expect(peaks).toStrictEqual([{ x: 7, y: 5, z: 6, width: 5 }]);
});

const negativeSpectrum: MeasurementXY = {
  variables: {
    x: {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      label: 'x',
    },
    y: {
      data: [
        -1, -2, -3, -4, -5, -6, -5, -4, -3, -2, -3, -4, -5, -6, -5, -4, -3, -2,
        -1,
      ],
      label: 'y',
    },
    z: {
      data: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6, 5, 4, 3, 2],
      label: 'z',
    },
  },
};

test('autoPeakPicking negative maxCriteria=false', () => {
  const peaks = autoPeakPicking(negativeSpectrum, {
    maxCriteria: false,
    noiseLevel: 0,
  });

  expect(peaks).toStrictEqual([
    { x: 6, y: -6, z: 5, width: 6 },
    { x: 14, y: -6, z: 5, width: 6 },
  ]);
});

test('autoPeakPicking negative xVariable=x, yVariable=z, from:2, to:18', () => {
  const peaks = autoPeakPicking(negativeSpectrum, {
    xVariable: 'x',
    yVariable: 'z',
    from: 2,
    to: 18,
    noiseLevel: 0,
  });

  expect(peaks).toStrictEqual([{ x: 7, y: -5, z: 6, width: 5 }]);
});
