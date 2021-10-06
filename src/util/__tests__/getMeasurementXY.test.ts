import type { MeasurementXY } from 'cheminfo-types';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { getMeasurementXY } from '../getMeasurementXY';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const measurements: MeasurementXY[] = [
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
    description: 'My measurement',
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

describe('getMeasurementXY', () => {
  it('MeasurementXY by labels', () => {
    let xy = getMeasurementXY(measurements, {
      xLabel: 'Weight [mg]',
      yLabel: 'Temperature [°C]',
    })?.variables;

    // @ts-expect-error
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
    let xy =
      getMeasurementXY(measurements, {
        xLabel: 'weight',
        yLabel: 'temp',
      })?.variables || {};

    // @ts-expect-error
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
    let xy = getMeasurementXY(measurements, query)?.variables || {};

    // @ts-expect-error
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

  it('MeasurementXY by units "" vs °C', () => {
    let xy =
      getMeasurementXY(measurements, { units: 'vs °C' })?.variables || {};

    // @ts-expect-error
    xy.x.data = Array.from(xy.x.data);
    expect(xy).toStrictEqual({
      x: {
        units: '°C',
        label: 'Temperature',
        data: [30, 40],
        min: 30,
        max: 40,
        isMonotone: true,
      },
      y: {
        units: '',
        label: 'Weight',
        data: [10, 20],
        min: 10,
        max: 20,
        isMonotone: true,
      },
    });
  });

  it('MeasurementXY by units °C vs g', () => {
    let xy =
      getMeasurementXY(measurements, { xUnits: '°C', yUnits: 'g' })
        ?.variables || {};

    // @ts-expect-error
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

  it('MeasurementXY by dataType TGA', () => {
    let xy =
      getMeasurementXY(measurements, { dataType: 'TGA' })?.variables || {};

    // @ts-expect-error
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

  it('MeasurementXY by description My', () => {
    let xy =
      getMeasurementXY(measurements, { description: 'My' })?.variables || {};

    // @ts-expect-error
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
    let xy =
      getMeasurementXY(measurements, { meta: { meta2: 'meta' } })?.variables ||
      {};

    // @ts-expect-error
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

  it('MeasurementXY by units L vs °F', () => {
    let xy = getMeasurementXY(measurements, { xUnits: 'L', yUnits: '°F' });
    expect(xy).toBeDeepCloseTo({
      description: 'My measurement',
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

  it('MeasurementXY by units s vs g as units', () => {
    let xy =
      getMeasurementXY(measurements, { units: 'g vs s' })?.variables || {};

    // @ts-expect-error
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

  it('xVariable: t, yVariable: Z', () => {
    // @ts-expect-error We still allow upper or lowercase, this could change in the future
    let xy = getMeasurementXY(measurements, { xVariable: 't', yVariable: 'Z' });
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
    let xy = getMeasurementXY(measurements, { variables: 'Z vs t' });
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
