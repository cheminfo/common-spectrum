import { MeasurementVariable } from 'cheminfo-types';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

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
    min: data ? min(data) : undefined,
    max: data ? max(data) : undefined,
    isMonotone: xIsMonotone(data),
  };
}
