import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import type { Spectrum } from '../../types/Cheminfo';
import { peakPicking } from '../peakPicking';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('peakPicking', () => {
  const spectrum: Spectrum = {
    variables: {
      x: {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        label: 'x',
      },
      y: {
        data: [1, 2, 3, 2, 1, 0, 1, 2, 3, 2],
        label: 'y',
      },
      z: {
        data: [0.1, 0.2, 0.3, 0.2, 0.1, 0, 0.1, 0.2, 0.3, 0.2],
        label: 'z',
      },
      t: {
        data: Float64Array.from([10, 20, 30, 20, 10, 0, 10, 20, 30, 20]),
        label: 't',
      },
    },
  };

  it('No options', () => {
    const peak = peakPicking(spectrum, 2);
    expect(peak).toStrictEqual({ x: 2, y: 2, z: 0.2, t: 20 });
  });
  it('optimize=true', () => {
    const peak = peakPicking(spectrum, 2, {
      optimize: true,
      shape: { kind: 'gaussian', fwhm: 1 },
    });
    expect(peak).toBeDeepCloseTo({
      x: 3,
      y: 3,
      z: 0.3,
      t: 30,
      optimized: {
        x: 2.9996130659938474,
        y: 2.813512484947132,
        shape: { kind: 'gaussian', fwhm: 3.189568901564484 },
      },
    });
  });
  it('max=false, optimize=true', () => {
    const peak = peakPicking(spectrum, 6, {
      optimize: true,
      max: false,
    });
    expect(peak).toBeDeepCloseTo({
      x: 6,
      y: 0,
      z: 0,
      t: 0,
      optimized: {
        x: 5.99663089533847,
        y: 2.80563493205562,
        shape: { kind: 'gaussian', fwhm: 3.199263679459118 },
      },
    });
  });
});
