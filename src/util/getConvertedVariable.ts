import { xIsMonotone, xMinValue, xMaxValue } from 'ml-spectra-processing';

import { SpectrumVariable } from '../types/Cheminfo';

import { convertUnit } from './convertUnit';

export function getConvertedVariable(
  variable: SpectrumVariable,
  newUnits: string,
): SpectrumVariable {
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
    isMonotone: xIsMonotone(data),
  };
}
