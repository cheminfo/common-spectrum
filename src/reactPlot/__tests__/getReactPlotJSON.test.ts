import { Analysis } from '../..';
import { getReactPlotJSON } from '../getReactPlotJSON';

const spectra = {
  variables: {
    x: {
      data: [1, 2],
      units: 'V',
      label: 'Voltage [V]',
    },
    y: {
      data: [0.5, 0.2],
      units: 'A',
      label: 'Current [A]',
    },
    z: {
      data: [5, 6],
      units: '°C',
      label: 'Temperature [°C]',
    },
    t: {
      data: [7, 8],
      units: 's',
      label: 'Time [s]',
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
    { id: 'x', label: 'Voltage [V]', position: 'bottom', type: 'main' },
    {
      id: 'y',
      label: 'Current [A]',
      position: 'left',
      labelSpace: 40,
      type: 'main',
    },
  ]);
});

test('enforce growing', () => {
  const len = 3;
  let analyses = new Array(len);
  for (let i = 0; i < len; i++) {
    analyses[i] = new Analysis();
    analyses[i].pushSpectrum(spectra.variables, { title: `Vg = ${i + 3}` });
  }

  // ignored value
  analyses.push(new Analysis());

  const result = getReactPlotJSON(
    analyses,
    {
      xLabel: 'Voltage',
      xUnits: 'kV',
      yLabel: 'Current',
      yUnits: 'mA',
    },
    { enforceGrowing: true },
  );
  expect(result.series).toHaveLength(len);
  expect(result.axes).toStrictEqual([
    { id: 'x', label: 'Voltage [kV]', position: 'bottom', type: 'main' },
    {
      id: 'y',
      label: 'Current [mA]',
      position: 'left',
      labelSpace: 40,
      type: 'main',
    },
  ]);
});
