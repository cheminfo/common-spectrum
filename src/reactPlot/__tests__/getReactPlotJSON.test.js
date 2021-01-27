import { Analysis } from '../..';
import { getReactPlotJSON } from '../getReactPlotJSON';

const spectra = {
  variables: {
    x: {
      data: [1, 2],
      units: 'V',
      label: 'Voltage',
    },
    y: {
      data: [0.5, 0.2],
      units: 'A',
      label: 'Current',
    },
    z: {
      data: [5, 6],
      units: '°C',
      label: 'Temperature',
    },
    t: {
      data: [7, 8],
      units: 's',
      label: 'Time',
    },
  },
};

test('simple test case', () => {
  const len = 3;
  let analyses = new Array(len);
  for (let i = 0; i < len; i++) {
    analyses[i] = new Analysis();
    analyses[i].pushSpectrum(spectra.variables, { title: `Vg = ${i + 3}` });
  }

  // ignored value
  analyses.push(new Analysis());

  const result = getReactPlotJSON(analyses, {
    xLabel: 'Voltage',
    xUnits: 'V',
    yLabel: 'Current',
    yUnits: 'A',
  });
  expect(result.series).toHaveLength(len);
  expect(result.axes).toStrictEqual([
    { label: 'Voltage', position: 'bottom' },
    { label: 'Current', position: 'left', labelSpace: 40 },
  ]);
});
