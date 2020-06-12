import { CommonSpectrum } from '..';

test('index', () => {
  const { Analysis, fromJcamp, toJcamp, getJSGraph } = CommonSpectrum({
    dataType: 'MY DATA TYPE',
  });

  let analysis = new Analysis();
  expect(analysis.id).toHaveLength(8);

  analysis.pushSpectrum(
    { x: [1, 2], y: [3, 4] },
    {
      xUnits: 'xUnits',
      yUnits: 'yUnits',
      xLabel: 'X axis',
      yLabel: 'Y axis',
      title: 'My spectrum',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  let firstSpectrum = analysis.getSpectrum();
  expect(firstSpectrum.x).toStrictEqual([1, 2]);
  expect(firstSpectrum.y).toStrictEqual([3, 4]);

  let normalized = analysis.getNormalizedData({
    normalization: {
      filters: [{ name: 'normalize' }],
    },
  });
  expect(normalized.y[0] + normalized.y[1]).toBeCloseTo(1, 10);

  let undefinedSpectrum = analysis.getSpectrum({ index: 2 });
  expect(undefinedSpectrum).toBeUndefined();

  let myFlavor = analysis.getSpectrum('myFlavor');
  expect(myFlavor.x).toStrictEqual([1, 2]);
  expect(myFlavor.y).toStrictEqual([3, 4]);

  let jsgraph = getJSGraph([analysis]);
  expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

  let jcamp = toJcamp(analysis, {
    info: {
      owner: 'cheminfo',
      origin: 'Common Spectrum',
    },
  });

  let analysis2 = fromJcamp(jcamp);

  expect(analysis2.spectra[0]).toStrictEqual({
    x: [1, 2],
    y: [3, 4],
    xLabel: 'X axis [xUnits]',
    yLabel: 'Y axis [yUnits]',
    xUnits: 'xUnits',
    yUnits: 'yUnits',
    title: 'My spectrum',
    dataType: 'TGA',
    meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
    flavor: 'yUnits vs xUnits',
  });
});
