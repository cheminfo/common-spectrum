import type { DoubleArray, MeasurementXY } from 'cheminfo-types';
import { filterXY } from 'ml-signal-processing';
import { xIsMonotonic, xMaxValue, xMinValue } from 'ml-spectra-processing';

import type { NormalizedSpectrumOptions } from '../types/NormalizedSpectrumOptions.js';

export function getNormalizedSpectrum(
  spectrum: MeasurementXY,
  options: NormalizedSpectrumOptions = {},
) {
  const data = {
    x: spectrum.variables.x.data,
    y: spectrum.variables.y.data,
  };
  const newSpectrum: MeasurementXY = {
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
  if (spectrum.id) newSpectrum.id = spectrum.id;

  const {
    from = spectrum.variables.x.min,
    to = spectrum.variables.x.max,
    numberOfPoints,
    applyRangeSelectionFirst = false,
    exclusions = [],
    zones = [],
  } = options;
  let { filters = [] } = options;

  filters = structuredClone(filters);
  if (numberOfPoints) {
    if (applyRangeSelectionFirst) {
      filters.unshift({
        name: 'equallySpaced',
        options: { from, to, exclusions, zones, numberOfPoints },
      });
    } else {
      filters.push({
        name: 'equallySpaced',
        options: { from, to, exclusions, zones, numberOfPoints },
      });
    }
  } else if (applyRangeSelectionFirst) {
    filters.unshift({
      name: 'filterX',
      options: { from, to, exclusions, zones },
    });
  } else {
    filters.push({
      name: 'filterX',
      options: { from, to, exclusions, zones },
    });
  }

  const { x, y } = filterXY(data, filters).data as {
    x: DoubleArray;
    y: DoubleArray;
  };

  // filters change the y axis, we get rid of the units
  // TODO we should deal correctly with this problem
  if (filters.length > 1) {
    newSpectrum.variables.y.units = '';
    newSpectrum.variables.y.label = newSpectrum.variables.y.label?.replace(
      /\s*\[.*]/,
      '',
    );
  }
  newSpectrum.variables.x.data = x;
  newSpectrum.variables.x.min = xMinValue(x);
  newSpectrum.variables.x.max = xMaxValue(x);
  newSpectrum.variables.x.isMonotonic = xIsMonotonic(x);
  newSpectrum.variables.y.data = y;
  newSpectrum.variables.y.min = xMinValue(y);
  newSpectrum.variables.y.max = xMaxValue(y);
  newSpectrum.variables.y.isMonotonic = xIsMonotonic(y);

  return newSpectrum;
}
