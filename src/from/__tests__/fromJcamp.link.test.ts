import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../fromJcamp';

test('fromJcamp linked file', () => {
  let jcamp = readFileSync(join(__dirname, './data/uv-link.jdx'), 'utf8');

  let result = fromJcamp(jcamp);
  console.log(result);

  expect(result.spectra).toHaveLength(2);

  let first = result.spectra[0];

  expect(first.variables.x.data).toHaveLength(2251);
  expect(first.variables.y.data).toHaveLength(2251);
  expect(first.variables.x.label).toStrictEqual('Ts [°C]');
  expect(first.variables.y.label).toStrictEqual('Value [mg]');

  let second = result.spectra[1];

  expect(second.variables.x.data).toHaveLength(2251);
  expect(second.variables.y.data).toHaveLength(2251);
  expect(second.variables.x.label).toStrictEqual('t [s]');
  expect(second.variables.y.label).toStrictEqual('Value [mg]');
});
