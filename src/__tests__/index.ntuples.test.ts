import { Analysis, fromJcamp, toJcamp, toJcamps, JSGraph } from '..';

describe('case for ntuples', () => {
  let analysis = new Analysis();

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
      description: 'My spectrum',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  it('Check analysis ID', () => {
    expect(analysis.id).toHaveLength(8);
  });

  it('First spectrum', () => {
    let firstSpectrum = analysis.getXYSpectrum();

    expect(firstSpectrum?.variables.x.data).toStrictEqual([1, 2]);
    expect(firstSpectrum?.variables.y.data).toStrictEqual([3, 4]);

    let normalized = analysis.getNormalizedSpectrum({
      normalization: {
        filters: [{ name: 'normalize' }],
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
    let spectrum = analysis.getXYSpectrum(selector);
    expect(spectrum?.variables.x.data).toStrictEqual([5, 6]);
    expect(spectrum?.variables.y.data).toStrictEqual([1, 2]);

    let jsgraph = JSGraph.getJSGraph([analysis], { selector });
    expect(jsgraph.series[0].data).toStrictEqual({ x: [5, 6], y: [1, 2] });

    let jcamps = toJcamps(analysis, {
      info: {
        owner: 'cheminfo',
        origin: 'Common MeasurementXY',
      },
    });

    expect(jcamps).toHaveLength(1);

    let jcamp = toJcamp(analysis, {
      info: {
        owner: 'cheminfo',
        origin: 'Common MeasurementXY',
      },
    });

    let analysis2 = fromJcamp(jcamp);

    expect(analysis2.spectra[0]).toStrictEqual({
      variables: {
        x: {
          symbol: 'x',
          isDependent: false,
          dim: 2,
          units: 'xUnits',
          data: [1, 2],
          isMonotone: true,
          min: 1,
          max: 2,
          label: 'X axis',
        },
        y: {
          isDependent: true,
          dim: 2,
          units: 'yUnits',
          isMonotone: true,
          min: 3,
          max: 4,
          data: [3, 4],
          label: 'Y axis',
        },
        t: {
          symbol: 't',
          isDependent: true,
          dim: 2,
          units: 'tUnits',
          isMonotone: true,
          min: 5,
          max: 6,
          data: [5, 6],
          label: 'T axis',
        },
      },
      description: 'My spectrum',
      dataType: 'TGA',
      meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
    });
  });
});
