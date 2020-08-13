import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { getXYSpectrum } from '../getXYSpectrum';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('getXYSpectrum', () => {
  const spectra = [
    {
      variables: {
        x: {
          data: Float64Array.from([1, 2]),
          units: 'mg',
          label: 'Weight [mg]',
        },
        y: {
          data: [3, 4],
          units: '°C',
          label: 'Temperature [°C]',
        },
        z: {
          data: [5, 6],
          units: '°C',
          label: 'Expected temperature [°C]',
        },
        t: {
          data: Float64Array.from([7, 8]),
          units: 's',
          label: 'Time [s]',
        },
      },
    },
    {
      variables: {
        x: {
          data: [1, 2],
          units: 'mL',
          label: 'Volume [mL]',
        },
        y: {
          data: [3, 4],
          units: '°C',
          label: 'Temperature [°C]',
        },
      },
      title: 'My spectrum',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  ];

  it('Spectrum by units s vs g', () => {
    let xy = getXYSpectrum(spectra, { xUnits: 's', yUnits: 'g' }).variables;
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: 's',
        label: 'Time [s]',
        data: [7, 8],
        min: 7,
        max: 8,
        isMonotone: true,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotone: true,
      },
    });
  });

  it('Spectrum by units °C vs g', () => {
    let xy = getXYSpectrum(spectra, { xUnits: '°C', yUnits: 'g' }).variables;
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: '°C',
        label: 'Temperature [°C]',
        data: [3, 4],
        min: 3,
        max: 4,
        isMonotone: true,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotone: true,
      },
    });
  });

  it('Spectrum by units L vs °F', () => {
    let xy = getXYSpectrum(spectra, { xUnits: 'L', yUnits: '°F' });
    expect(xy).toBeDeepCloseTo({
      title: 'My spectrum',
      dataType: 'TGA',
      meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
      variables: {
        x: {
          units: 'L',
          label: 'Volume [L]',
          data: [0.001, 0.002],
          min: 0.001,
          max: 0.002,
          isMonotone: true,
        },
        y: {
          units: '°F',
          label: 'Temperature [°F]',
          data: [37.4, 39.2],
          min: 37.4,
          max: 39.2,
          isMonotone: true,
        },
      },
    });
  });

  it('Spectrum by units s vs g as units', () => {
    let xy = getXYSpectrum(spectra, { units: 'g vs s' }).variables;
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: 's',
        label: 'Time [s]',
        data: [7, 8],
        min: 7,
        max: 8,
        isMonotone: true,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotone: true,
      },
    });
  });
});