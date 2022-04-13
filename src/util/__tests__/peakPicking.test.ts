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
    let peak = peakPicking(spectrum, 2);
    expect(peak).toStrictEqual({ x: 2, y: 2, z: 0.2, t: 20 });
  });
  it('optimize=true', () => {
    let peak = peakPicking(spectrum, 2, { optimize: true });
    expect(peak).toBeDeepCloseTo({
      x: 3,
      y: 3,
      z: 0.3,
      t: 30,
      optimized: {
        x: 2.9995777634192518,
        y: 2.813804719395019,
        fwhm: 3.18888848260097,
        shape: { kind: 'gaussian' },
      },
    });
  });
  it('max=false, optimize=true', () => {
    let peak = peakPicking(spectrum, 6, {
      optimize: true,
      max: false,
    });
    expect(peak).toBeDeepCloseTo({
      x: 6,
      y: 0,
      z: 0,
      t: 0,
      optimized: {
        x: 5.9966268483642535,
        y: 2.8055786511335583,
        fwhm: 3.19939212677305,
        shape: { kind: 'gaussian' },
      },
    });
  });
});
