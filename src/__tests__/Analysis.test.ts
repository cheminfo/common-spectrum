import { readFileSync } from 'fs';
import { join } from 'path';

import { describe, it, expect } from 'vitest';

import { fromJcamp } from '..';

describe('Analysis', () => {
  it('getXY', () => {
    const text = readFileSync(
      join(__dirname, '../../testFiles/xps.jdx'),
      'utf-8',
    );

    const analysis = fromJcamp(text);

    const xy = analysis.getXY() || { x: [], y: [] };
    expect(xy.x).toHaveLength(91);
    expect(xy.y).toHaveLength(91);
  });
});
