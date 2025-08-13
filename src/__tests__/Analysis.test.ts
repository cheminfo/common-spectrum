import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { fromJcamp } from '../index.js';

describe('Analysis', () => {
  it('getXY', () => {
    const text = readFileSync(
      join(import.meta.dirname, '../../testFiles/xps.jdx'),
      'utf8',
    );

    const analysis = fromJcamp(text);

    const xy = analysis.getXY() || { x: [], y: [] };

    expect(xy.x).toHaveLength(91);
    expect(xy.y).toHaveLength(91);
  });
});
