import { CommonSpectrum } from '..';

test('index', () => {
  const {
    Analysis,
    AnalysesManager,
    fromJcamp,
    toJcamp,
    getNormalized,
    getJSGraph,
  } = new CommonSpectrum({
    dataType: 'TYPE',
    defaultFlavor: 'myFlavor',
  });

  let analysis = new Analysis();
  expect(analysis.id).toHaveLength(8);
  expect(analysis.defaultFlavor).toBe('myFlavor');

  analysis.set(
    { x: [1, 2], y: [3, 4] },
    {
      xLabel: 'X axis',
      yLabel: 'Y axis',
      title: 'My spectrum',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  let defaultFlavorSpectrum = analysis.get();
  expect(defaultFlavorSpectrum.x).toStrictEqual([1, 2]);
  expect(defaultFlavorSpectrum.y).toStrictEqual([3, 4]);

  let data = getNormalized(defaultFlavorSpectrum, {
    filters: [{ name: 'normalize' }],
  });
  expect(data.y[0] + data.y[1]).toBeCloseTo(1, 10);

  let undefinedFlavor = analysis.get('test');
  expect(undefinedFlavor).toBeUndefined();

  let myFlavor = analysis.get('myFlavor');
  expect(myFlavor.x).toStrictEqual([1, 2]);
  expect(myFlavor.y).toStrictEqual([3, 4]);

  let jsgraph = getJSGraph([analysis]);

  expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

  let jcamp = toJcamp(analysis);

  let analysis2 = fromJcamp(jcamp);
  expect(analysis2.spectra.myflavor).toStrictEqual({
    x: [1, 2],
    y: [3, 4],
    xLabel: 'X axis',
    yLabel: 'Y axis',
    title: 'My spectrum',
    meta: {
      meta1: 'Meta 1',
      meta2: 'Meta 2',
    },
  });
});
