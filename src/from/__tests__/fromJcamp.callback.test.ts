import { readFileSync } from 'fs';
import { join } from 'path';

import type { MeasurementVariable } from 'cheminfo-types';

import { fromJcamp } from '../fromJcamp';

function irCallback(variables: Record<string, MeasurementVariable>) {
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

describe('fromJcamp with callback', () => {
  it('absorbance', () => {
    let jcamp = readFileSync(
      join(__dirname, '../../../testFiles/ir.jdx'),
      'utf8',
    );

    const result = fromJcamp(jcamp, { spectrumCallback: irCallback });
    const spectrum = result.spectra[0];
    expect(spectrum.variables.x.label).toBe('1/CM');
    expect(spectrum.variables.y.label).toBe('ABSORBANCE');
    // @ts-expect-error
    expect(spectrum.variables.t.label).toBe('Transmittance');
    // @ts-expect-error
    expect(spectrum.variables.t.units).toBe('%');
    expect(spectrum.variables.x.data).toHaveLength(1738);
    expect(spectrum.variables.y.data).toHaveLength(1738);
    // @ts-expect-error
    expect(spectrum.variables.t.data).toHaveLength(1738);
  });
});
