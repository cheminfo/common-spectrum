import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

import { AnalysesManager, Analysis, fromJcamp } from '../index.js';

describe('AnalysesManager test', () => {
  let analysis1: Analysis;
  let analysis2: Analysis;
  let analysis3: Analysis;
  let analysesManager: AnalysesManager;

  beforeEach(() => {
    analysis1 = new Analysis();
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

    analysis2 = new Analysis();
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

    analysis3 = new Analysis();
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

    analysesManager = new AnalysesManager();
    analysesManager.addAnalysis(analysis1);
    analysesManager.addAnalysis(analysis2);
    analysesManager.addAnalysis(analysis3);
  });

  it('getDistinctTitles', () => {
    const titles = analysesManager.getDistinctTitles();

    expect(titles).toHaveLength(2);
  });

  it('getDistinctDataTypes', () => {
    const dataTypes = analysesManager.getDistinctDataTypes();

    expect(dataTypes).toHaveLength(1);
  });

  it('getDistinctMeta', () => {
    const meta = analysesManager.getDistinctMeta();

    expect(meta).toHaveLength(3);
  });

  it('getDistinctUnits', () => {
    const units = analysesManager.getDistinctUnits();

    expect(units).toHaveLength(5);
  });

  it('getDistinctLabels', () => {
    const labels = analysesManager.getDistinctLabels();

    expect(labels).toHaveLength(4);
  });

  it('getDistinctLabelUnits', () => {
    const labels = analysesManager.getDistinctLabelUnits();

    expect(labels).toHaveLength(5);
    expect(labels[2]).toStrictEqual({
      key: 'T axis (tUnits)',
      units: 'tUnits',
      label: 'T axis',
      count: 2,
    });
  });
});

describe('AnalysesManager isotherm', () => {
  let analysis: Analysis;
  let analysesManager: AnalysesManager;

  beforeEach(() => {
    const jcamp = readFileSync(
      join(import.meta.dirname, '../from/__tests__/data/isotherm.jdx'),
    );
    analysis = fromJcamp(jcamp);
    analysesManager = new AnalysesManager();
    analysesManager.addAnalysis(analysis);
  });

  it('distinctLabelUnits', () => {
    const distinctLabelUnits = analysesManager.getDistinctLabelUnits();

    expect(distinctLabelUnits).toHaveLength(3);
  });
});
