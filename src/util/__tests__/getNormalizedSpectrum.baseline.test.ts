import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { expect, test } from 'vitest';

import { getNormalizedSpectrum } from '../getNormalizedSpectrum.js';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const spectrum = {
  variables: {
    x: {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      units: 's',
      label: 'X axis [s]',
    },
    y: {
      data: [2, 3, 4, 5, 30, 7, 8, 9, 10, 11],
      units: '°C',
      label: 'Y axis [°C]',
    },
  },
};

test('getNormalizedSpectrum airPLSBaseline', () => {
  const normalized = getNormalizedSpectrum(spectrum, {
    filters: [{ name: 'airPLSBaseline' }],
  });

  expect(normalized.variables.y.data).toMatchCloseTo([
    -2.863064853469851, -2.1493713388168363, -1.4857172746495415,
    -0.895836353581859, 23.6247520477486, 0.14534044907906107,
    0.6803801233596101, 1.2745641752281642, 1.9462022038245834,
    2.67836563984053,
  ]);
});

test('getNormalizedSpectrum rollingAverageBaseline', () => {
  const normalized = getNormalizedSpectrum(spectrum, {
    filters: [{ name: 'rollingAverageBaseline' }],
  });

  expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
    0, 0.5, 0.5, 0.5, 12.5, -11.5, 0.5, 0.5, 0.5, 0.5,
  ]);
});

test('getNormalizedSpectrum iterativePolynomialBaseline', () => {
  const normalized = getNormalizedSpectrum(spectrum, {
    filters: [{ name: 'iterativePolynomialBaseline' }],
  });

  expect(normalized.variables.y.data).toMatchCloseTo([
    2.8027267837051744, 1.391581607428921, 0.49299960881358595,
    0.01931655737200977, 23.883170619799778, 0, 0.2740427530456975,
    0.6263371572550227, 0.9667213421160419, 1.208391608391885,
  ]);
});

test('getNormalizedSpectrum rollingMedianBaseline', () => {
  const normalized = getNormalizedSpectrum(spectrum, {
    filters: [{ name: 'rollingMedianBaseline' }],
  });

  expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
    0, 1, 1, 1, 25, 0, 1, 1, 1, 1,
  ]);
});
