import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { expect, test } from 'vitest';

import { convertUnit } from '../convertUnit.js';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

test('getConversionFactor', () => {
  expect(convertUnit(1, 'mg', 'g')).toBeCloseTo(0.001, 6);
  expect(convertUnit([1, 2, 3], 'g', 'mg')).toBeDeepCloseTo(
    [1000, 2000, 3000],
    6,
  );
  expect(convertUnit(1, 'kg', 'ug')).toBeCloseTo(1e9, 6);
  expect(() => convertUnit(1, 'kg', 'ml')).toThrow(
    'Incompatible units: kg and ml',
  );
  expect(convertUnit(100, 'tempC', 'tempK')).toBeCloseTo(373.15, 6);
  expect(convertUnit(100, '°C', 'K')).toBeCloseTo(373.15, 6);
  expect(convertUnit(100, 'tempC', 'tempF')).toBeCloseTo(212, 6);
  expect(convertUnit(100, 'min', 's')).toBeCloseTo(6000, 6);
  expect(convertUnit(100, 'm^2', 'cm^2')).toBeCloseTo(1000000, 6);
  expect(convertUnit(100, 'm^2 / cal', 'cm^2 / J')).toBeCloseTo(
    1000000 / 4.184,
    6,
  );
  expect(convertUnit(100, 'm^2 cal', 'cm^2 J')).toBeCloseTo(1000000 * 4.184, 6);
  expect(convertUnit(100, 'm^2 * cal', 'cm^2 * J')).toBeCloseTo(
    1000000 * 4.184,
    6,
  );
});
