import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

import { convertUnit } from '../convertUnit';

test('getConversionFactor', () => {
  expect(convertUnit(1, 'mg', 'g')).toBeCloseTo(0.001, 6);
  expect(convertUnit([1, 2, 3], 'g', 'mg')).toBeDeepCloseTo(
    [1000, 2000, 3000],
    6,
  );
  expect(convertUnit(1, 'kg', 'ug')).toBeCloseTo(1e9, 6);
  expect(convertUnit(1, 'kg', 'ml')).toBeUndefined();
  expect(convertUnit(100, 'tempC', 'tempK')).toBeCloseTo(373.15, 6);
  expect(convertUnit(100, 'tempC', 'tempF')).toBeCloseTo(212, 6);
});
