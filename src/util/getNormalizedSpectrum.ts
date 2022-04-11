import max from 'ml-array-max';
import min from 'ml-array-min';
import { filterXY } from 'ml-signal-processing';
import { xIsMonotone } from 'ml-spectra-processing';

import type { Spectrum } from '../types/Cheminfo';
import { NormalizedSpectrumOptions } from '../types/NormalizedSpectrumOptions';

export function getNormalizedSpectrum(
  spectrum: Spectrum,
  options: NormalizedSpectrumOptions = {},
) {
  let data = {
    x: spectrum.variables.x.data,
    y: spectrum.variables.y.data,
  };
  let newSpectrum: Spectrum = {
    variables: {
      x: {
        data: spectrum.variables.x.data,
        units: spectrum.variables.x.units,
        label: spectrum.variables.x.label,
      },
      y: {
        data: spectrum.variables.y.data,
        units: spectrum.variables.y.units,
        label: spectrum.variables.y.label,
      },
    },
  };
  if (spectrum.title) newSpectrum.title = spectrum.title;
  if (spectrum.dataType) newSpectrum.dataType = spectrum.dataType;
  if (spectrum.meta) newSpectrum.meta = spectrum.meta;

  let {
    from = spectrum.variables.x.min,
    to = spectrum.variables.x.max,
    numberOfPoints,
    filters = [],
    exclusions = [],
    zones = [],
    keepYUnits = false,
  } = options;

  filters = JSON.parse(JSON.stringify(filters));
  if (numberOfPoints) {
    filters.push({
      name: 'equallySpaced',
      options: { from, to, exclusions, zones, numberOfPoints },
    });
  } else {
    filters.push({
      name: 'filterX',
      options: { from, to, exclusions, zones },
    });
  }

  let { x, y } = filterXY(data, filters);

  if (!keepYUnits && filters.length) {
    // filters change the y axis, we get rid of the units
    newSpectrum.variables.y.units = '';
    newSpectrum.variables.y.label = newSpectrum.variables.y.label?.replace(
      /\s*\[.*\]/,
      '',
    );
  }

  newSpectrum.variables.x.data = x;
  newSpectrum.variables.x.min = min(x);
  newSpectrum.variables.x.max = max(x);
  newSpectrum.variables.x.isMonotone = xIsMonotone(x);
  newSpectrum.variables.y.data = y;
  newSpectrum.variables.y.min = min(y);
  newSpectrum.variables.y.max = max(y);
  newSpectrum.variables.y.isMonotone = xIsMonotone(y);

  return newSpectrum;
}
