import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { MeasurementXYVariables } from 'cheminfo-types';
import { expect, test } from 'vitest';

import { fromJcamp } from '../fromJcamp.js';

function irCallback(variables: MeasurementXYVariables) {
  if (variables.y.label === 'ABSORBANCE') {
    variables.t = {
      data: variables.y.data.map(
        (absorbance: number) => 10 ** -absorbance * 100,
      ),
      label: 'Transmittance (%)',
      units: '',
    };
  }
}

test('fromJcamp with callback absorbance', () => {
  const jcamp = readFileSync(join(import.meta.dirname, 'data/ir.jdx'), 'utf8');

  const result = fromJcamp(jcamp, { spectrumCallback: irCallback });
  const spectrum: any = result.spectra[0];

  expect(spectrum.variables.x.label).toBe('1/CM');
  expect(spectrum.variables.y.label).toBe('ABSORBANCE');
  expect(spectrum.variables.t.label).toBe('Transmittance');
  expect(spectrum.variables.t.units).toBe('%');
  expect(spectrum.variables.x.data).toHaveLength(1738);
  expect(spectrum.variables.y.data).toHaveLength(1738);
  expect(spectrum.variables.t.data).toHaveLength(1738);
});
