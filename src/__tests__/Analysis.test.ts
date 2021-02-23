import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '..';

describe('Analysis', () => {
  it('getXY', () => {
    const text = readFileSync(
      join(__dirname, '../../testFiles/xps.jdx'),
      'utf-8',
    );

    let analysis = fromJcamp(text);

    let xy = analysis.getXY();
    expect(xy.x).toHaveLength(91);
    expect(xy.y).toHaveLength(91);
  });
});
