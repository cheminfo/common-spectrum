import { Spectrum } from 'cheminfo-types';
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
    let peaks = autoPeakPicking(spectrum);
    expect(peaks).toStrictEqual([
      { x: 6, y: 6, z: 5, width: 4 },
      { x: 14, y: 6, z: 5, width: 4 },
    ]);
  });
  it('xVariable=x, yVariable=z', () => {
    let peaks = autoPeakPicking(spectrum, { xVariable: 'x', yVariable: 'z' });
    expect(peaks).toStrictEqual([{ x: 7, y: 5, z: 6, width: 4 }]);
  });

  it('minPeakWidth: 5', () => {
    let peaks = autoPeakPicking(spectrum, { minPeakWidth: 5 });
    expect(peaks).toStrictEqual([]);
  });

  it('xVariable=x, yVariable=z, from:2, to:18', () => {
    let peaks = autoPeakPicking(spectrum, {
      xVariable: 'x',
      yVariable: 'z',
      from: 2,
      to: 18,
    });
    expect(peaks).toStrictEqual([{ x: 7, y: 5, z: 6, width: 4 }]);
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
    let peaks = autoPeakPicking(spectrum, { maxCriteria: false });

    expect(peaks).toStrictEqual([
      { x: 6, y: -6, z: 5, width: 4 },
      { x: 14, y: -6, z: 5, width: 4 },
    ]);
  });

  it('xVariable=x, yVariable=z, from:2, to:18', () => {
    let peaks = autoPeakPicking(spectrum, {
      xVariable: 'x',
      yVariable: 'z',
      from: 2,
      to: 18,
    });
    expect(peaks).toStrictEqual([{ x: 7, y: -5, z: 6, width: 4 }]);
  });
});
