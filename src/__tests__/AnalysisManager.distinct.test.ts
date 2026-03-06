import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { AnalysesManager, Analysis, fromJcamp } from '../index.js';

function createAnalysesManager() {
  const analysis1 = new Analysis();
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

  const analysis2 = new Analysis();
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

  const analysis3 = new Analysis();
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
  return analysesManager;
}

test('getDistinctTitles', () => {
  const titles = createAnalysesManager().getDistinctTitles();

  expect(titles).toHaveLength(2);
});

test('getDistinctDataTypes', () => {
  const dataTypes = createAnalysesManager().getDistinctDataTypes();

  expect(dataTypes).toHaveLength(1);
});

test('getDistinctMeta', () => {
  const meta = createAnalysesManager().getDistinctMeta();

  expect(meta).toHaveLength(3);
});

test('getDistinctUnits', () => {
  const units = createAnalysesManager().getDistinctUnits();

  expect(units).toHaveLength(5);
});

test('getDistinctLabels', () => {
  const labels = createAnalysesManager().getDistinctLabels();

  expect(labels).toHaveLength(4);
});

test('getDistinctLabelUnits', () => {
  const labels = createAnalysesManager().getDistinctLabelUnits();

  expect(labels).toHaveLength(5);
  expect(labels[2]).toStrictEqual({
    key: 'T axis (tUnits)',
    units: 'tUnits',
    label: 'T axis',
    count: 2,
  });
});

test('AnalysesManager isotherm distinctLabelUnits', () => {
  const jcamp = readFileSync(
    join(import.meta.dirname, '../from/__tests__/data/isotherm.jdx'),
  );
  const analysis = fromJcamp(jcamp);
  const analysesManager = new AnalysesManager();
  analysesManager.addAnalysis(analysis);

  const distinctLabelUnits = analysesManager.getDistinctLabelUnits();

  expect(distinctLabelUnits).toHaveLength(3);
});
