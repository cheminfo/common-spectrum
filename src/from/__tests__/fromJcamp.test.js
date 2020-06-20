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

    expect(first.x).toHaveLength(2251);
    expect(first.y).toHaveLength(2251);
    expect(first.xLabel).toStrictEqual('Ts [°C]');
    expect(first.yLabel).toStrictEqual('Value [mg]');
    expect(first.flavor).toStrictEqual('mg vs °C');

    let second = result.spectra[1];

    expect(second.x).toHaveLength(2251);
    expect(second.y).toHaveLength(2251);
    expect(second.xLabel).toStrictEqual('t [s]');
    expect(second.yLabel).toStrictEqual('Value [mg]');
    expect(second.flavor).toStrictEqual('mg vs s');
  });

  it('ntuples', () => {
    let jcamp = readFileSync(
      join(__dirname, '../../../testFiles/ntuples.jdx'),
      'utf8',
    );

    let result = fromJcamp(jcamp).spectra[0];
    expect(result.x).toHaveLength(408);
    expect(result.y).toHaveLength(408);
    expect(result.xUnits).toBe('µg');
    expect(result.yUnits).toBe('°C');
    expect(result.xLabel).toBe('Weight [µg]');
    expect(result.yLabel).toBe('Temperature [°C]');
  });
});
