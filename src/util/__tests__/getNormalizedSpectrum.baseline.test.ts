import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { describe, expect, it } from 'vitest';

import { getNormalizedSpectrum } from '../getNormalizedSpectrum';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('getNormalizedSpectrum baseline', () => {
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

  it('airPLSBaseline', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'airPLSBaseline' }],
    });

    expect(normalized.variables.y.data).toMatchCloseTo([
      -3.348924551896295, -2.683817007085925, -2.018709462275555,
      -1.353601917465185, 23.222833282627597, -0.2007315172796238,
      0.3570528945238909, 0.947322487043996, 1.6097774136570404,
      2.3725249215064004,
    ]);
  });

  it('rollingaveragebaseline', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'rollingAverageBaseline' }],
    });

    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      0, 0.5, 0.5, 0.5, 12.5, -11.5, 0.5, 0.5, 0.5, 0.5,
    ]);
  });

  it('iterativepolynomialbaseline', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'iterativePolynomialBaseline' }],
    });

    expect(normalized.variables.y.data).toMatchCloseTo([
      2.8027267837051744, 1.391581607428921, 0.49299960881358595,
      0.01931655737200977, 23.883170619799778, 0, 0.2740427530456975,
      0.6263371572550227, 0.9667213421160419, 1.208391608391885,
    ]);
  });

  it('rollingAverageBaseline', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'rollingAverageBaseline' }],
    });

    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      0, 0.5, 0.5, 0.5, 12.5, -11.5, 0.5, 0.5, 0.5, 0.5,
    ]);
  });

  it('rollingMedianBaseline', () => {
    const normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'rollingMedianBaseline' }],
    });

    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      0, 1, 1, 1, 25, 0, 1, 1, 1, 1,
    ]);
  });
});
