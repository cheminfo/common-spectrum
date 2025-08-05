import { expect, test } from 'vitest';

import { Analysis, JSGraph, fromJcamp, toJcamp } from '..';

test('index', () => {
  const analysis = new Analysis();

  expect(analysis.id).toHaveLength(8);

  analysis.pushSpectrum(
    {
      x: {
        data: [1, 2],
        isMonotonic: 1,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis',
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

  const firstSpectrum = analysis.getXYSpectrum();

  expect(firstSpectrum?.variables.x.data).toStrictEqual([1, 2]);
  expect(firstSpectrum?.variables.y.data).toStrictEqual([3, 4]);

  const normalizedSpectrum = analysis.getNormalizedSpectrum({
    normalization: {
      filters: [{ name: 'normed' }],
    },
  });

  expect(
    (normalizedSpectrum?.variables?.y?.data?.[0] || 0) +
      (normalizedSpectrum?.variables?.y?.data?.[1] || 0),
  ).toBeCloseTo(1, 10);

  const undefinedSpectrum = analysis.getXYSpectrum({ xUnits: 'J' });

  expect(undefinedSpectrum).toBeUndefined();

  const inverted = analysis.getXYSpectrum({
    xUnits: 'yUnits',
    yUnits: 'xUnits',
  });

  expect(inverted?.variables.x.data).toStrictEqual([3, 4]);
  expect(inverted?.variables.y.data).toStrictEqual([1, 2]);

  const jsgraph = JSGraph.getJSGraph([analysis]);

  expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

  const jcamp = toJcamp(analysis, {
    info: {
      owner: 'cheminfo',
      origin: 'Common MeasurementXY',
    },
  });

  const analysis2 = fromJcamp(jcamp);
  delete analysis2.spectra[0].id;

  expect(analysis2.spectra[0]).toStrictEqual({
    variables: {
      x: {
        data: [1, 2],
        isMonotonic: 1,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis',
        symbol: 'X',
      },
      y: {
        data: [3, 4],
        isMonotonic: 1,
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis',
        symbol: 'Y',
      },
    },
    title: 'My spectrum',
    dataType: 'TGA',
    meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
  });
});
