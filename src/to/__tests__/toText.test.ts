import { expect, test } from 'vitest';

import { Analysis } from '../../Analysis.js';
import { toText } from '../toText.js';

function createAnalysis() {
  const analysis = new Analysis();
  analysis.pushSpectrum({
    x: {
      data: [1, 2, 3],
      min: 1,
      max: 2,
      units: 'V',
      label: 'voltage',
    },
    y: {
      data: [3, 4, 5],
      min: 3,
      max: 4,
      units: 'mA',
      label: 'current',
    },
    t: {
      data: [5, 6, 7],
      min: 5,
      max: 7,
      units: 's',
      label: 'seconds',
    },
  });
  return analysis;
}

test('toText all variables', () => {
  const result = toText(createAnalysis());

  expect(result).toHaveLength(1);
  expect(result[0]).toBe('voltage,current,seconds\n1,3,5\n2,4,6\n3,5,7');
});

test('toText select variables', () => {
  const result = toText(createAnalysis(), {
    selector: { xLabel: 'seconds', yLabel: 'voltage' },
  });

  expect(result).toHaveLength(1);
  expect(result[0]).toBe('seconds,voltage\n5,1\n6,2\n7,3');
});

test('toText empty analysis', () => {
  const result = toText(new Analysis());

  expect(result).toHaveLength(0);
});

test('toText select variables with normalization', () => {
  const result = toText(createAnalysis(), {
    selector: { xLabel: 'seconds', yLabel: 'voltage' },
    normalization: { from: 5, to: 6 },
  });

  expect(result).toHaveLength(1);
  expect(result[0]).toBe('seconds,voltage\n5,1\n6,2');
});
