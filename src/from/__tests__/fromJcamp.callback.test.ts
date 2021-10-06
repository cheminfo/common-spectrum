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

    const result = fromJcamp(jcamp, { measurementCallback: irCallback });
    const measurement = result.measurements[0];
    expect(measurement.variables.x.label).toBe('1/CM');
    expect(measurement.variables.y.label).toBe('ABSORBANCE');
    // @ts-expect-error
    expect(measurement.variables.t.label).toBe('Transmittance');
    // @ts-expect-error
    expect(measurement.variables.t.units).toBe('%');
    expect(measurement.variables.x.data).toHaveLength(1738);
    expect(measurement.variables.y.data).toHaveLength(1738);
    // @ts-expect-error
    expect(measurement.variables.t.data).toHaveLength(1738);
  });
});
