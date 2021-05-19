import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { getNormalizedSpectrum } from '../getNormalizedSpectrum';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('getNormalizedSpectrum baseline', () => {
  let spectrum = {
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
    let normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'airPLSBaseline' }],
    });
    expect(normalized.variables.y.data).toMatchCloseTo([
      -3.169014084442461, -2.2007042253000275, -1.25440140841972,
      -0.3080985915394123, 24.638204225340896, 1.584507042221202,
      2.5308098591015087, 3.4771126759818163, 4.423415492862123,
      5.36971830974243,
    ]);
  });

  it('rollingaveragebaseline', () => {
    let normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'rollingAverageBaseline' }],
    });
    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      0, 0.5, 0.5, 0.5, 12.5, -11.5, 0.5, 0.5, 0.5, 0.5,
    ]);
  });

  it('iterativepolynomialbaseline', () => {
    let normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'iterativePolynomialBaseline' }],
    });
    expect(normalized.variables.y.data).toMatchCloseTo([
      2.8027267837051744, 1.391581607428921, 0.49299960881358595,
      0.01931655737200977, 23.883170619799778, 0, 0.2740427530456975,
      0.6263371572550227, 0.9667213421160419, 1.208391608391885,
    ]);
  });

  it('rollingballbaseline', () => {
    let normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'rollingballBaseline' }],
    });
    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      -0.5, 0, 0, -8, 16, -8, 0, 0, 0, 0.5,
    ]);
  });

  it('rollingmedianbaseline', () => {
    let normalized = getNormalizedSpectrum(spectrum, {
      filters: [{ name: 'rollingMedianBaseline' }],
    });
    expect(Array.from(normalized.variables.y.data)).toMatchCloseTo([
      0, 1, 1, 1, 25, 0, 1, 1, 1, 1,
    ]);
  });
});
