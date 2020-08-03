import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import { convertUnit } from './convertUnit';

export function getConvertedVariable(variable, newUnits) {
  const data =
    variable.units !== newUnits // would be nice if convertUnit would allow typedArray
      ? convertUnit(Array.from(variable.data), variable.units, newUnits)
      : variable.data;
  return {
    units: newUnits,
    label: variable.label.replace(`[${variable.units}]`, `[${newUnits}]`),
    data,
    min: min(data),
    max: max(data),
    isMonotone: xIsMonotone(data),
  };
}
