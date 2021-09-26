import { Spectrum } from 'cheminfo-types/src/index';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

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
        width: 3.189546886416098,
        x: 2.999611971277297,
        y: 2.813521959845332,
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
        width: 3.200124158892267,
        x: 5.996603710710172,
        y: 2.8052577297402275,
      },
    });
  });
});
