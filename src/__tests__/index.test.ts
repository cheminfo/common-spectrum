import { Analysis, fromJcamp, toJcamp, JSGraph } from '..';

test('index', () => {
  let analysis = new Analysis();
  expect(analysis.id).toHaveLength(8);

  analysis.pushMeasurement(
    {
      x: {
        data: [1, 2],
        isMonotone: true,
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
      description: 'My measurement',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  let firstMeasurement = analysis.getMeasurementXY();

  expect(firstMeasurement?.variables.x.data).toStrictEqual([1, 2]);
  expect(firstMeasurement?.variables.y.data).toStrictEqual([3, 4]);

  let normalizedMeasurement = analysis.getNormalizedMeasurement({
    normalization: {
      filters: [{ name: 'normalize' }],
    },
  });
  expect(
    (normalizedMeasurement?.variables?.y?.data?.[0] || 0) +
      (normalizedMeasurement?.variables?.y?.data?.[1] || 0),
  ).toBeCloseTo(1, 10);

  let undefinedMeasurement = analysis.getMeasurementXY({ xUnits: 'J' });
  expect(undefinedMeasurement).toBeUndefined();

  let inverted = analysis.getMeasurementXY({
    xUnits: 'yUnits',
    yUnits: 'xUnits',
  });
  expect(inverted?.variables.x.data).toStrictEqual([3, 4]);
  expect(inverted?.variables.y.data).toStrictEqual([1, 2]);

  let jsgraph = JSGraph.getJSGraph([analysis]);
  expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

  let jcamp = toJcamp(analysis, {
    info: {
      owner: 'cheminfo',
      origin: 'Common MeasurementXY',
    },
  });

  let analysis2 = fromJcamp(jcamp);

  expect(analysis2.measurements[0]).toStrictEqual({
    variables: {
      x: {
        data: [1, 2],
        isMonotone: true,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis',
        symbol: 'X',
      },
      y: {
        data: [3, 4],
        isMonotone: true,
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis',
        symbol: 'Y',
      },
    },
    description: 'My measurement',
    dataType: 'TGA',
    meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
  });
});
