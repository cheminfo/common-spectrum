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

    expect(result.measurements).toHaveLength(2);

    let first = result.measurements[0];

    expect(first.variables.x.data).toHaveLength(2251);
    expect(first.variables.y.data).toHaveLength(2251);
    expect(first.variables.x.label).toStrictEqual('Ts');
    expect(first.variables.x.units).toStrictEqual('°C');
    expect(first.variables.y.label).toStrictEqual('Value');
    expect(first.variables.y.units).toStrictEqual('mg');

    let second = result.measurements[1];

    expect(second.variables.x.data).toHaveLength(2251);
    expect(second.variables.y.data).toHaveLength(2251);
    expect(second.variables.x.label).toStrictEqual('t');
    expect(second.variables.x.units).toStrictEqual('s');
    expect(second.variables.y.label).toStrictEqual('Value');
    expect(second.variables.y.units).toStrictEqual('mg');
  });

  it('ntuples', () => {
    let jcamp = readFileSync(
      join(__dirname, '../../../testFiles/ntuples.jdx'),
      'utf8',
    );

    let result = fromJcamp(jcamp).measurements[0];

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
