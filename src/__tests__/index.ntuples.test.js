import { Analysis, fromJcamp, toJcamp, getJSGraph } from '..';

describe('case for ntuples', () => {
  let analysis = new Analysis();

  analysis.pushSpectrum(
    {
      x: {
        data: [1, 2],
        isMonotone: true,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis [yUnits]',
      },
      t: {
        data: [5, 6],
        min: 5,
        max: 6,
        units: 'tUnits',
        label: 'T axis [tUnits]',
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

  it('Check analysis ID', () => {
    expect(analysis.id).toHaveLength(8);
  });

  it('First spectrum', () => {
    let firstSpectrum = analysis.getSpectrum();

    expect(firstSpectrum.variables.x.data).toStrictEqual([1, 2]);
    expect(firstSpectrum.variables.y.data).toStrictEqual([3, 4]);
    expect(firstSpectrum.variables.t.data).toStrictEqual([5, 6]);

    let normalized = analysis.getNormalizedData({
      normalization: {
        filters: [{ name: 'normalize' }],
      },
    });
    expect(normalized.y[0] + normalized.y[1]).toBeCloseTo(1, 10);
  });

  it('Spectrum by index', () => {
    let undefinedSpectrum = analysis.getSpectrum({ index: 2 });
    expect(undefinedSpectrum).toBeUndefined();
  });

  it('Spectrum by flavor', () => {
    let myFlavor = analysis.getSpectrum('myFlavor');
    expect(myFlavor.variables.x.data).toStrictEqual([1, 2]);
    expect(myFlavor.variables.y.data).toStrictEqual([3, 4]);

    let jsgraph = getJSGraph([analysis]);
    expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

    let jcamp = toJcamp(analysis, {
      info: {
        owner: 'cheminfo',
        origin: 'Common Spectrum',
      },
    });

    let analysis2 = fromJcamp(jcamp);

    expect(analysis2.spectra[0]).toStrictEqual({
      variables: {
        x: {
          name: 'X axis',
          symbol: 'x',
          type: 'INDEPENDENT',
          dim: 2,
          units: 'xUnits',
          data: [1, 2],
          isMonotone: true,
          min: 1,
          max: 2,
          label: 'X axis [xUnits]',
        },
        y: {
          name: 'Y axis',
          symbol: 'y',
          type: 'DEPENDENT',
          dim: 2,
          units: 'yUnits',
          isMonotone: true,
          min: 3,
          max: 4,
          data: [3, 4],
          label: 'Y axis [yUnits]',
        },
        t: {
          name: 'T axis',
          symbol: 't',
          type: 'DEPENDENT',
          dim: 2,
          units: 'tUnits',
          isMonotone: true,
          min: 5,
          max: 6,
          data: [5, 6],
          label: 'T axis [tUnits]',
        },
      },
      title: 'My spectrum',
      dataType: 'TGA',
      meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
      flavor: 'yUnits vs xUnits',
    });
  });
});
