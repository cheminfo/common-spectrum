import type { MeasurementXY } from 'cheminfo-types';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { describe, expect, it } from 'vitest';

import { getXYSpectra } from '../getXYSpectra';

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
        units: 'mL',
        label: 'milliliters',
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
  {
    variables: {
      x: {
        data: [10, 20],
        units: 'g',
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

describe('getXYSpectra', () => {
  it('No filter', () => {
    const xy = getXYSpectra(spectra, {});

    expect(xy).toHaveLength(3);
  });

  it('Many spectry with specific units', () => {
    const xy = getXYSpectra(spectra, { xUnits: 'ug', yUnits: '°C' });

    expect(xy).toHaveLength(2);
    expect(xy[1].variables).toStrictEqual({
      x: {
        units: 'ug',
        label: 'Weight',
        data: [10000000, 20000000],
        min: 10000000,
        max: 20000000,
        isMonotonic: 1,
      },
      y: {
        units: '°C',
        label: 'Temperature',
        data: [30, 40],
        min: 30,
        max: 40,
        isMonotonic: 1,
      },
    });
  });

  it('MeasurementXY by labels', () => {
    const xy = getXYSpectra(spectra, {
      xLabel: 'Weight [mg]',
      yLabel: 'Temperature [°C]',
    })[0].variables;

    xy.x.data = Array.from(xy.x.data);

    expect(xy).toStrictEqual({
      x: {
        units: 'mg',
        label: 'Weight [mg]',
        data: [1, 2],
      },
      y: {
        units: '°C',
        label: 'Expected temperature [°C]',
        data: [5, 6],
      },
    });
  });
});
