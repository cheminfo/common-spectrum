import { Analysis, fromJcamp, toJcamp, JSGraph } from '..';

test('index', () => {
  let analysis = new Analysis();
  expect(analysis.id).toHaveLength(8);

  analysis.pushSpectrum(
    {
      x: {
        data: [1, 2],
        isMonotone: true,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis [yUnits]',
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

  let firstSpectrum = analysis.getXYSpectrum();

  expect(firstSpectrum.variables.x.data).toStrictEqual([1, 2]);
  expect(firstSpectrum.variables.y.data).toStrictEqual([3, 4]);

  let normalizedSpectrum = analysis.getNormalizedSpectrum({
    normalization: {
      filters: [{ name: 'normalize' }],
    },
  });
  expect(
    normalizedSpectrum.variables.y.data[0] +
      normalizedSpectrum.variables.y.data[1],
  ).toBeCloseTo(1, 10);

  let undefinedSpectrum = analysis.getXYSpectrum({ xUnits: 'J' });
  expect(undefinedSpectrum).toBeUndefined();

  let inverted = analysis.getXYSpectrum({ xUnits: 'yUnits', yUnits: 'xUnits' });
  expect(inverted.variables.x.data).toStrictEqual([3, 4]);
  expect(inverted.variables.y.data).toStrictEqual([1, 2]);

  let jsgraph = JSGraph.getJSGraph([analysis]);
  expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

  let jcamp = toJcamp(analysis, {
    info: {
      owner: 'cheminfo',
      origin: 'Common Spectrum',
    },
  });

  let analysis2 = fromJcamp(jcamp);

  expect(analysis2.spectra[0]).toStrictEqual({
    variables: {
      x: {
        data: [1, 2],
        isMonotone: true,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis [xUnits]',
        symbol: 'X',
      },
      y: {
        data: [3, 4],
        isMonotone: true,
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis [yUnits]',
        symbol: 'Y',
      },
    },
    title: 'My spectrum',
    tmp: {},
    dataType: 'TGA',
    meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
  });
});
