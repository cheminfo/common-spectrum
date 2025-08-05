import type { MeasurementXY } from 'cheminfo-types';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { describe, expect, it } from 'vitest';

import { getXYSpectrum } from '../getXYSpectrum';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const spectra: MeasurementXY[] = [
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
      e: {
        data: Float64Array.from([2, 1]),
        units: 'J',
        label: 'Energy',
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
  {
    variables: {
      x: {
        data: [10, 20],
        units: '',
        label: 'Weight',
      },
      y: {
        data: [30, 40],
        units: '°C',
        label: 'Temperature',
      },
    },
  },
];

describe('getXYSpectrum', () => {
  it('MeasurementXY by labels', () => {
    const xy: any = getXYSpectrum(spectra, {
      xLabel: 'Weight [mg]',
      yLabel: 'Temperature [°C]',
    })?.variables;

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: 'mg',
        label: 'Weight [mg]',
        data: [1, 2],
      },
      y: {
        units: '°C',
        label: 'Temperature [°C]',
        data: [3, 4],
      },
    });
  });

  it('MeasurementXY by partial labels', () => {
    const xy: any =
      getXYSpectrum(spectra, {
        xLabel: 'weight',
        yLabel: 'temp',
      })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: 'mg',
        label: 'Weight [mg]',
        data: [1, 2],
      },
      y: {
        units: '°C',
        label: 'Temperature [°C]',
        data: [3, 4],
      },
    });
  });

  it('MeasurementXY by units s vs g', () => {
    const query = { xUnits: 's', yUnits: 'g' };
    const xy: any = getXYSpectrum(spectra, query)?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: 's',
        label: 'Time [s]',
        data: [7, 8],
        min: 7,
        max: 8,
        isMonotonic: 1,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotonic: 1,
      },
    });
  });

  it('MeasurementXY by units "" vs °C', () => {
    const xy: any = getXYSpectrum(spectra, { units: 'vs °C' })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: '°C',
        label: 'Temperature',
        data: [30, 40],
        min: 30,
        max: 40,
        isMonotonic: 1,
      },
      y: {
        units: '',
        label: 'Weight',
        data: [10, 20],
        min: 10,
        max: 20,
        isMonotonic: 1,
      },
    });
  });

  it('MeasurementXY by units °C vs g', () => {
    const xy: any =
      getXYSpectrum(spectra, { xUnits: '°C', yUnits: 'g' })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: '°C',
        label: 'Temperature [°C]',
        data: [3, 4],
        min: 3,
        max: 4,
        isMonotonic: 1,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotonic: 1,
      },
    });
  });

  it('MeasurementXY by dataType TGA', () => {
    const xy: any =
      getXYSpectrum(spectra, { dataType: 'TGA' })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
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
    });
  });

  it('MeasurementXY by title My', () => {
    const xy: any = getXYSpectrum(spectra, { title: 'My' })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
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
    });
  });

  it('MeasurementXY by meta meta2="Meta"', () => {
    const xy: any =
      getXYSpectrum(spectra, { meta: { meta2: 'meta' } })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
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
    });
  });

  it('MeasurementXY by units g vs J as units', () => {
    const xy: any =
      getXYSpectrum(spectra, { units: 'g vs J' })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: 'J',
        label: 'Energy',
        data: [1, 2],
        min: 1,
        max: 2,
        isMonotonic: 1,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.002, 0.001],
        min: 0.001,
        max: 0.002,
        isMonotonic: 1,
      },
    });
  });

  it('MeasurementXY by units L vs °F', () => {
    const xy = getXYSpectrum(spectra, { xUnits: 'L', yUnits: '°F' });

    expect(xy).toMatchCloseTo({
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
          isMonotonic: 1,
        },
        y: {
          units: '°F',
          label: 'Temperature [°F]',
          data: [37.4, 39.2],
          min: 37.4,
          max: 39.2,
          isMonotonic: 1,
        },
      },
    });
  });

  it('MeasurementXY by units s vs g as units', () => {
    const xy: any =
      getXYSpectrum(spectra, { units: 'g vs s' })?.variables || {};

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: 's',
        label: 'Time [s]',
        data: [7, 8],
        min: 7,
        max: 8,
        isMonotonic: 1,
      },
      y: {
        units: 'g',
        label: 'Weight [g]',
        data: [0.001, 0.002],
        min: 0.001,
        max: 0.002,
        isMonotonic: 1,
      },
    });
  });

  it('xVariable: t, yVariable: Z', () => {
    // @ts-expect-error we check that the variable is converted to lowercase
    const xy = getXYSpectrum(spectra, { xVariable: 't', yVariable: 'Z' });

    expect(xy).toMatchObject({
      variables: {
        x: {
          units: 's',
          label: 'Time [s]',
        },
        y: {
          units: '°C',
          label: 'Expected temperature [°C]',
        },
      },
    });
  });

  it('variables: Z vs t', () => {
    const xy = getXYSpectrum(spectra, { variables: 'Z vs t' });

    expect(xy).toMatchObject({
      variables: {
        x: {
          units: 's',
          label: 'Time [s]',
        },
        y: {
          units: '°C',
          label: 'Expected temperature [°C]',
        },
      },
    });
  });
});
