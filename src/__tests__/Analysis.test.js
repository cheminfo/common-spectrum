import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '..';

test('peak picking', () => {
  const text = readFileSync(
    join(__dirname, '../../testFiles/xps.jdx'),
    'utf-8',
  );

  let analysis = fromJcamp(text);

  let peaks = analysis.getPeaks({ gsd: { minMaxRatio: 0.4 } });
  expect(peaks).toHaveLength(1);
  expect(peaks[0].x).toBeCloseTo(531.4);
});
