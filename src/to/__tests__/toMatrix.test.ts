import { test, expect } from 'vitest';

import { Analysis } from '../..';
import { toMatrix } from '../toMatrix';

test('toMatrix', () => {
  const analyses = getTestAnalyses();
  const text = toMatrix(analyses, {
    normalization: {
      filters: [{ name: 'normed', options: { algorithm: 'max', value: 100 } }],
    },
  });
  expect(text).toBe(`x	My spectrum	My spectrum
-1	50	50
1	75	75
2	100	0
3	0	100`);
});

function getTestAnalyses(): Analysis[] {
  const analysis1 = new Analysis();

  analysis1.pushSpectrum(
    {
      x: {
        data: [-1, 1, 2],
        units: 'xUnits',
        label: 'X axis (xUnits)',
      },
      y: {
        data: [2, 3, 4],
        units: 'yUnits',
        label: 'Y axis [yUnits]',
      },
      z: {
        data: [20, 30, 40],
        units: 'zUnits',
        label: 'Z axis [zUnits]',
      },
    },
    {
      title: 'My spectrum',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  const analysis2 = new Analysis();

  analysis2.pushSpectrum(
    {
      x: {
        data: [-1, 1, 3],
        units: 'xUnits',
        label: 'X axis (xUnits)',
      },
      y: {
        data: [2, 3, 4],
        units: 'yUnits',
        label: 'Y axis [yUnits]',
      },
      z: {
        data: [20, 30, 40],
        units: 'zUnits',
        label: 'Z axis [zUnits]',
      },
    },
    {
      title: 'My spectrum',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  return [analysis1, analysis2];
}
