import { readFileSync } from 'fs';
import { join } from 'path';

import { generateSpectrum } from 'spectrum-generator';

import { fromJcamp } from '../..';
import { peakPicking } from '../peakPicking';

test('peak picking on simulated spectrum', () => {
  const peaks = [
    [4, 10],
    [20, 30],
    [236, 1],
    [569, 76],
  ];
  const spectrum = generateSpectrum(peaks, {
    from: 0, // default value: 0
    to: 1000, // default value: 1000
    nbPoints: 10001, // default value: 10001
    factor: 3, // default value would covers 99.99% of the surface and depends on the shape
    shape: {
      kind: 'gaussian', // default value is gaussian
    },
  });
  let pickedPeaks = peakPicking(spectrum);
  expect(pickedPeaks).toHaveLength(4);
  expect(pickedPeaks[0].x).toBeCloseTo(4);
  expect(pickedPeaks[0].y).toBeCloseTo(10);
});

describe('peak picking on actual spectrum', () => {
  const text = readFileSync(
    join(__dirname, '../../../testFiles/xps.jdx'),
    'utf-8',
  );

  let analysis = fromJcamp(text);

  let xy = analysis.getXY();

  it('GSD', () => {
    let peaks = peakPicking(xy, { minMaxRatio: 0.4 });

    expect(peaks).toHaveLength(1);
    expect(peaks[0].x).toBeCloseTo(531.4);
  });
});
