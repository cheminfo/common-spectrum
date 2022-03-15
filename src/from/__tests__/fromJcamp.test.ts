import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../fromJcamp';

describe('fromJcamp', () => {
  it('normal', () => {
    let jcamp = readFileSync(
      join(__dirname, '../../../testFiles/jcamp.jdx'),
      'utf8',
    );

    let result = fromJcamp(jcamp);

    expect(result.spectra).toHaveLength(2);

    let first = result.spectra[0];

    expect(first.variables.x.data).toHaveLength(2251);
    expect(first.variables.y.data).toHaveLength(2251);
    expect(first.variables.x.label).toBe('Ts');
    expect(first.variables.x.units).toBe('°C');
    expect(first.variables.y.label).toBe('Value');
    expect(first.variables.y.units).toBe('mg');

    let second = result.spectra[1];

    expect(second.variables.x.data).toHaveLength(2251);
    expect(second.variables.y.data).toHaveLength(2251);
    expect(second.variables.x.label).toBe('t');
    expect(second.variables.x.units).toBe('s');
    expect(second.variables.y.label).toBe('Value');
    expect(second.variables.y.units).toBe('mg');
  });

  it('ntuples', () => {
    let jcamp = readFileSync(
      join(__dirname, '../../../testFiles/ntuples.jdx'),
      'utf8',
    );

    let result = fromJcamp(jcamp).spectra[0];

    expect(result.variables.x.data).toHaveLength(408);
    expect(result.variables.y.data).toHaveLength(408);
    expect(result.variables.x.units).toBe('µg');
    expect(result.variables.y.units).toBe('°C');
    expect(result.variables.x.label).toBe('Weight');
    expect(result.variables.x.units).toBe('µg');
    expect(result.variables.y.label).toBe('Temperature');
    expect(result.variables.y.units).toBe('°C');
  });
});
