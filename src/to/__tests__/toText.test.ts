import { Analysis } from '../../Analysis';
import { toText } from '../toText';

const analysis = new Analysis();
analysis.pushSpectrum({
  x: {
    data: [1, 2],
    min: 1,
    max: 2,
    units: 'V',
    label: 'voltage',
  },
  y: {
    data: [3, 4],
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

describe('toCvs', () => {
  it('all variables', () => {
    const result = toText(analysis);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('voltage,current,seconds\n1,3,5\n2,4,6\n,,7');
  });

  it('select variables', () => {
    const result = toText(analysis, {
      selector: { xLabel: 'seconds', yLabel: 'voltage' },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('seconds,voltage\n5,1\n6,2\n7,');
  });

  it('empty analysis', () => {
    const result = toText(new Analysis());
    expect(result).toHaveLength(0);
  });
});
