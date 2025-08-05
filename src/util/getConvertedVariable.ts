import { xIsMonotonic, xMaxValue, xMinValue } from 'ml-spectra-processing';

import type { MeasurementVariable } from 'cheminfo-types';

import { convertUnit } from './convertUnit';

export function getConvertedVariable(
  variable: MeasurementVariable,
  newUnits: string,
): MeasurementVariable {
  const data =
    variable.units !== undefined && variable.units !== newUnits // would be nice if convertUnit would allow typedArray
      ? convertUnit(Array.from(variable.data), variable.units, newUnits)
      : variable.data;
  return {
    units: newUnits,
    label: variable.label.replace(`[${variable.units || ''}]`, `[${newUnits}]`),
    data: data || [],
    min: data ? xMinValue(data) : undefined,
    max: data ? xMaxValue(data) : undefined,
    isMonotonic: xIsMonotonic(data) !== 0,
  };
}
