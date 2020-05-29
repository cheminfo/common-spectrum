import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../fromJcamp';

test('fromJcamp', () => {
  let jcamp = readFileSync(
    join(__dirname, '../../../testFiles/jcamp.jdx'),
    'utf8',
  );
  let result = fromJcamp(jcamp);

  expect(result.get('weightVersusTime').x).toHaveLength(2251);
  expect(result.get('weightVersusTime').y).toHaveLength(2251);
  expect(result.get('weightVersusTime').xLabel).toStrictEqual('t [s]');
  expect(result.get('weightVersusTime').yLabel).toStrictEqual('Value [mg]');

  expect(result.get('weightversustemperature').x).toHaveLength(2251);
  expect(result.get('weightversustemperature').y).toHaveLength(2251);
  expect(result.get('weightversustemperature').xLabel).toStrictEqual('Ts [°C]');
  expect(result.get('weightversustemperature').yLabel).toStrictEqual(
    'Value [mg]',
  );
});
