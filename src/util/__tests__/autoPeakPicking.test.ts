import { describe, it, expect } from 'vitest';

import type { Spectrum } from '../../types/Cheminfo';
import { autoPeakPicking } from '../autoPeakPicking';

describe('autoPeakPicking positive', () => {
  const spectrum: Spectrum = {
    variables: {
      x: {
        data: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        ],
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

  it('No options', () => {
    const peaks = autoPeakPicking(spectrum, {});
    expect(peaks).toStrictEqual([]);
  });

  it('noiseLevel: 0', () => {
    const peaks = autoPeakPicking(spectrum, { noiseLevel: 0 });
    expect(peaks).toStrictEqual([
      { x: 6, y: 6, z: 5, width: 6 },
      { x: 14, y: 6, z: 5, width: 6 },
    ]);
  });
  it('xVariable=x, yVariable=z', () => {
    const peaks = autoPeakPicking(spectrum, {
      xVariable: 'x',
      yVariable: 'z',
      noiseLevel: 0,
    });
    expect(peaks).toStrictEqual([{ x: 7, y: 5, z: 6, width: 5 }]);
  });

  it('minPeakWidth: 5', () => {
    const peaks = autoPeakPicking(spectrum, { noiseLevel: 0, minPeakWidth: 7 });
    expect(peaks).toStrictEqual([]);
  });

  it('xVariable=x, yVariable=z, from:2, to:18', () => {
    const peaks = autoPeakPicking(spectrum, {
      xVariable: 'x',
      yVariable: 'z',
      from: 2,
      to: 18,
      noiseLevel: 0,
    });
    expect(peaks).toStrictEqual([{ x: 7, y: 5, z: 6, width: 5 }]);
  });
});

describe('autoPeakPicking negative', () => {
  const spectrum: Spectrum = {
    variables: {
      x: {
        data: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        ],
        label: 'x',
      },
      y: {
        data: [
          -1, -2, -3, -4, -5, -6, -5, -4, -3, -2, -3, -4, -5, -6, -5, -4, -3,
          -2, -1,
        ],
        label: 'y',
      },
      z: {
        data: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6, 5, 4, 3, 2],
        label: 'z',
      },
    },
  };

  it('maxCriteria=false', () => {
    const peaks = autoPeakPicking(spectrum, {
      maxCriteria: false,
      noiseLevel: 0,
    });

    expect(peaks).toStrictEqual([
      { x: 6, y: -6, z: 5, width: 6 },
      { x: 14, y: -6, z: 5, width: 6 },
    ]);
  });

  it('xVariable=x, yVariable=z, from:2, to:18', () => {
    const peaks = autoPeakPicking(spectrum, {
      xVariable: 'x',
      yVariable: 'z',
      from: 2,
      to: 18,
      noiseLevel: 0,
    });
    expect(peaks).toStrictEqual([{ x: 7, y: -5, z: 6, width: 5 }]);
  });
});
