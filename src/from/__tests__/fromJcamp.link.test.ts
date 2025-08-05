import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromJcamp } from '../fromJcamp.js';

test('fromJcamp linked file', () => {
  const jcamp = readFileSync(join(__dirname, './data/uv-link.jdx'), 'utf8');

  const result = fromJcamp(jcamp);

  expect(result.spectra).toHaveLength(2);

  const first = result.spectra[0];

  expect(first.variables.x.data).toHaveLength(911);
  expect(first.variables.y.data).toHaveLength(911);
  expect(first.variables.x.label).toBe('NANOMETERS');
  expect(first.variables.y.label).toBe('ABSORBANCE');

  const second = result.spectra[1];

  expect(second.variables.x.data).toHaveLength(911);
  expect(second.variables.y.data).toHaveLength(911);
  expect(second.variables.x.label).toBe('NANOMETERS');
  expect(second.variables.y.label).toBe('VARIANCE');
});
