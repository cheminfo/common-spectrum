import { readFileSync } from 'fs';
import { join } from 'path';

import { fromText } from '../fromText';

test('fromText', () => {
  let arrayBuffer = readFileSync(join(__dirname, 'data/uv.txt'));

  let result = fromText(arrayBuffer, {
    info: {
      xUnits: 'cm-1',
      yUnits: '',
      xLabel: 'Wavenumber',
      yLabel: 'Intensity',
      dataType: 'UV measurement',
    },
  });

  expect(result.measurements).toHaveLength(1);

  let first = result.measurements[0];

  expect(first.variables.x.data).toHaveLength(551);
  expect(first.variables.y.data).toHaveLength(551);
  expect(first.variables.x.label).toStrictEqual('Wavenumber');
  expect(first.variables.x.units).toStrictEqual('cm-1');
  expect(first.variables.y.label).toStrictEqual('Intensity');
  expect(first.variables.y.units).toStrictEqual('');
});
