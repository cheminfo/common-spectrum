import { readFileSync } from 'fs';
import { join } from 'path';
import { fromJcamp } from '../..';
import { peakPicking } from '../peakPicking';

describe('peakPicking', () => {
  const text = readFileSync(
    join(__dirname, '../../../testFiles/xps.jdx'),
    'utf-8',
  );

  let analysis = fromJcamp(text);

  let xy = analysis.getXY();

  it('GSD', () => {
    let peaks = peakPicking(xy, {});

    console.log(peaks);
  });
});
