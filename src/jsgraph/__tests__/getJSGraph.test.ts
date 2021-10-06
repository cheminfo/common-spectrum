import { Analysis, JSGraph } from '../..';

test('getJSGraph', () => {
  let analysis = new Analysis();
  expect(analysis.id).toHaveLength(8);

  analysis.pushMeasurement(
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

  const jsgraph = JSGraph.getJSGraph([analysis], {
    normalization: { filters: [{ name: 'multiply', options: { value: 100 } }] },
    xAxis: {
      logScale: true,
    },
  });

  delete jsgraph.series[0].name;

  expect(jsgraph).toMatchSnapshot();
});
