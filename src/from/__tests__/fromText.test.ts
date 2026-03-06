import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { toJcamp } from '../../to/toJcamp.js';
import { fromJcamp } from '../fromJcamp.js';
import { fromText } from '../fromText.js';

test('fromText', () => {
  const arrayBuffer = readFileSync(join(import.meta.dirname, 'data/uv.txt'));

  const result = fromText(arrayBuffer, {
    info: {
      xUnits: 'cm-1',
      yUnits: '',
      xLabel: 'Wavenumber',
      yLabel: 'Intensity',
    },
  });

  expect(result.spectra).toHaveLength(1);

  const first = result.spectra[0];

  expect(first.variables.x.data).toHaveLength(551);
  expect(first.variables.y.data).toHaveLength(551);
  expect(first.variables.x.label).toBe('Wavenumber');
  expect(first.variables.x.units).toBe('cm-1');
  expect(first.variables.y.label).toBe('Intensity');
  expect(first.variables.y.units).toBe('');
});

test('fromText with dataType', () => {
  const arrayBuffer = readFileSync(join(import.meta.dirname, 'data/uv.txt'));

  const result = fromText(arrayBuffer, {
    info: {
      xUnits: 'cm-1',
      xLabel: 'Wavenumber',
      yLabel: 'Intensity',
    },
    dataType: 'UV spectrum',
  });

  expect(result.spectra[0].dataType).toBe('UV spectrum');

  const jcamp = toJcamp(result);

  expect(jcamp).toContain('##DATA TYPE=UV spectrum');

  const roundtrip = fromJcamp(jcamp);

  expect(roundtrip.spectra[0].dataType).toBe('UV spectrum');
});
