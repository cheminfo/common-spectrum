import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromJcamp } from '../index.js';

test('Analysis getXY', () => {
  const text = readFileSync(
    join(import.meta.dirname, '../from/__tests__/data/xps.jdx'),
    'utf8',
  );

  const analysis = fromJcamp(text);

  const xy = analysis.getXY() || { x: [], y: [] };

  expect(xy.x).toHaveLength(91);
  expect(xy.y).toHaveLength(91);
});
