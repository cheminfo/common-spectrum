import { beforeEach, describe, expect, it } from 'vitest';

import { Analysis, JSGraph, fromJcamp, toJcamp, toJcamps } from '..';

describe('case for ntuples', () => {
  let analysis: Analysis;

  beforeEach(() => {
    analysis = new Analysis();

    analysis.pushSpectrum(
      {
        x: {
          data: [1, 2],
          min: 1,
          max: 2,
          units: 'xUnits',
          label: 'X axis',
        },
        y: {
          data: [3, 4],
          min: 3,
          max: 4,
          units: 'yUnits',
          label: 'Y axis',
        },
        t: {
          data: [5, 6],
          min: 5,
          max: 6,
          units: 'tUnits',
          label: 'T axis',
        },
      },
      {
        title: 'My spectrum',
        dataType: 'TGA',
        meta: {
          meta1: 'Meta 1',
          meta2: 'Meta 2',
        },
      },
    );
  });

  it('Check analysis ID', () => {
    expect(analysis.id).toHaveLength(8);
  });

  it('First spectrum', () => {
    const firstSpectrum = analysis.getXYSpectrum();

    expect(firstSpectrum?.variables.x.data).toStrictEqual([1, 2]);
    expect(firstSpectrum?.variables.y.data).toStrictEqual([3, 4]);

    const normalized = analysis.getNormalizedSpectrum({
      normalization: {
        filters: [{ name: 'normed' }],
      },
    })?.variables;

    expect(
      (normalized?.y?.data?.[0] || 0) + (normalized?.y?.data?.[1] || 0),
    ).toBeCloseTo(1, 10);
  });

  it('MeasurementXY by units', () => {
    const selector = {
      xUnits: 'tUnits',
      yUnits: 'xUnits',
    };
    const spectrum = analysis.getXYSpectrum(selector);

    expect(spectrum?.variables.x.data).toStrictEqual([5, 6]);
    expect(spectrum?.variables.y.data).toStrictEqual([1, 2]);

    const jsgraph = JSGraph.getJSGraph([analysis], { selector });

    expect(jsgraph.series[0].data).toStrictEqual({ x: [5, 6], y: [1, 2] });

    const jcamps = toJcamps(analysis, {
      info: {
        owner: 'cheminfo',
        origin: 'Common MeasurementXY',
      },
    });

    expect(jcamps).toHaveLength(1);

    const jcamp = toJcamp(analysis, {
      info: {
        owner: 'cheminfo',
        origin: 'Common MeasurementXY',
      },
    });

    const analysis2 = fromJcamp(jcamp);

    delete analysis2.spectra[0].id;

    expect(analysis2.spectra[0]).toStrictEqual({
      variables: {
        x: {
          name: 'X axis',
          symbol: 'x',
          type: 'INDEPENDENT',
          dim: 2,
          first: 1,
          last: 2,
          units: 'xUnits',
          data: [1, 2],
          isMonotonic: 1,
          min: 1,
          max: 2,
          label: 'X axis',
        },
        y: {
          name: 'Y axis',
          symbol: 'y',
          type: 'DEPENDENT',
          dim: 2,
          first: 3,
          last: 4,
          units: 'yUnits',
          isMonotonic: 1,
          min: 3,
          max: 4,
          data: [3, 4],
          label: 'Y axis',
        },
        t: {
          name: 'T axis',
          symbol: 't',
          type: 'DEPENDENT',
          dim: 2,
          first: 5,
          last: 6,
          units: 'tUnits',
          isMonotonic: 1,
          min: 5,
          max: 6,
          data: [5, 6],
          label: 'T axis',
        },
      },
      title: 'My spectrum',
      dataType: 'TGA',
      meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
    });
  });
});
