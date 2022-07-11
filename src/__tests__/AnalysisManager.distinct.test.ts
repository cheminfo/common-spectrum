import { Analysis, AnalysesManager } from '..';

describe('AnalysesManager test', () => {
  let analysis1 = new Analysis();
  analysis1.pushSpectrum(
    {
      x: {
        data: [1, 2],
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

  let analysis2 = new Analysis();
  analysis2.pushSpectrum(
    {
      x: {
        data: [1, 2],
        min: 1,
        max: 2,
        units: 'xUnits2',
        label: 'X axis2 [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits2',
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
      title: 'My spectrum 2',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta2 1',
        meta3: 'Meta 3',
      },
    },
  );

  let analysis3 = new Analysis();
  analysis3.pushSpectrum(
    {
      x: {
        data: [1, 2],
        min: 1,
        max: 2,
        units: 'xUnits2',
        label: 'X axis2 [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits2',
        label: 'Y axis [yUnits]',
      },
    },
    {
      title: 'My spectrum',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta2 1',
        meta3: 'Meta 3',
      },
    },
  );

  const analysesManager = new AnalysesManager();
  analysesManager.addAnalysis(analysis1);
  analysesManager.addAnalysis(analysis2);
  analysesManager.addAnalysis(analysis3);

  it('getDistinctTitles', () => {
    let titles = analysesManager.getDistinctTitles();
    expect(titles).toHaveLength(2);
  });

  it('getDistinctDataTypes', () => {
    let dataTypes = analysesManager.getDistinctDataTypes();
    expect(dataTypes).toHaveLength(1);
  });

  it('getDistinctMeta', () => {
    let meta = analysesManager.getDistinctMeta();
    expect(meta).toHaveLength(3);
  });

  it('getDistinctUnits', () => {
    let units = analysesManager.getDistinctUnits();
    expect(units).toHaveLength(5);
  });

  it('getDistinctLabels', () => {
    let labels = analysesManager.getDistinctLabels();
    expect(labels).toHaveLength(4);
  });

  it('getDistinctLabelUnits', () => {
    let labels = analysesManager.getDistinctLabelUnits();
    expect(labels).toHaveLength(5);
    expect(labels[2]).toStrictEqual({
      key: 'T axis (tUnits)',
      units: 'tUnits',
      label: 'T axis',
      count: 2,
    });
  });
});
