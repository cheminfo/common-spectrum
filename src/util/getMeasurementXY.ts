import type {
  OneLowerCase,
  MeasurementXY,
  MeasurementXYVariables,
} from 'cheminfo-types';

import { MeasurementSelector } from '../types/MeasurementSelector';

import { convertUnit } from './convertUnit';
import { ensureRegexp } from './ensureRegexp';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve the measurement with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 */
export function getMeasurementXY(
  measurements: Array<MeasurementXY> = [],
  selector: MeasurementSelector = {},
): MeasurementXY | undefined {
  if (measurements.length < 1) return;

  let {
    dataType,
    description,
    xUnits,
    yUnits,
    variables,
    xVariable = 'x',
    yVariable = 'y',
    units,
    labels,
    xLabel,
    yLabel,
    meta,
    index,
  } = selector;

  if (index !== undefined) {
    return measurements[index];
  }

  if (dataType) {
    dataType = ensureRegexp(dataType);
  }

  if (description) {
    description = ensureRegexp(description);
  }

  if (units && !xUnits && !yUnits) [yUnits, xUnits] = units.split(/\s*vs\s*/);
  if (labels && !xLabel && !yLabel) {
    [yLabel, xLabel] = labels.split(/\s*vs\s*/);
  }
  if (variables) {
    const parts = variables.split(/\s*vs\s*/);
    if (parts.length === 2) {
      xVariable = parts[1] as OneLowerCase;
      yVariable = parts[0] as OneLowerCase;
    }
  }

  if (xLabel) xLabel = ensureRegexp(xLabel);
  if (yLabel) yLabel = ensureRegexp(yLabel);

  for (let measurement of measurements) {
    let variableNames = Object.keys(measurement.variables);
    if (!(variableNames.length > 1)) continue;

    // we filter on general measurement information
    if (dataType) {
      if (!measurement.dataType || !measurement.dataType.match(dataType)) {
        continue;
      }
    }

    if (description) {
      if (
        !measurement.description ||
        !measurement.description.match(description)
      ) {
        continue;
      }
    }

    if (meta && typeof meta === 'object') {
      if (!measurement.meta) continue;
      for (let key in measurement.meta) {
        if (!measurement.meta[key]) continue;
        let value = ensureRegexp(measurement.meta[key]);
        if (!value.exec(measurement.meta[key])) continue;
      }
    }

    let x = getPossibleVariable(measurement.variables, {
      units: xUnits,
      label: xLabel,
      variableName: xVariable,
    });
    let y = getPossibleVariable(measurement.variables, {
      units: yUnits,
      label: yLabel,
      variableName: yVariable,
    });

    if (x && y) {
      return {
        description: measurement.description,
        dataType: measurement.dataType,
        meta: measurement.meta,
        variables: { x, y },
      };
    }
  }
  return;
}

interface Selector {
  units?: string;
  label?: string | RegExp;
  variableName?: OneLowerCase;
}
function getPossibleVariable(
  variables: MeasurementXYVariables,
  selector: Selector = {},
) {
  const { units, label, variableName } = selector;
  let possible = { ...variables };
  let key: keyof typeof possible;
  if (units !== undefined) {
    for (key in possible) {
      // @ts-ignore
      let converted = convertUnit(1, variables[key].units || '', units);
      if (converted) {
        // @ts-ignore
        possible[key] = getConvertedVariable(variables[key], units);
      } else {
        // @ts-ignore
        possible[key] = undefined;
      }
    }
  }

  if (label !== undefined) {
    for (key in possible) {
      // @ts-ignore
      if (!variables[key].label.match(label)) {
        // @ts-ignore
        possible[key] = undefined;
      }
    }
  }

  if (variableName !== undefined) {
    if (possible[variableName]) return possible[variableName];
    // @ts-ignore this should disappear if once for ever the variables are lowercases
    if (possible[variableName.toUpperCase()]) {
      // @ts-ignore
      return possible[variableName.toUpperCase()];
    }
    // @ts-ignore
    if (possible[variableName.toLowerCase()]) {
      // @ts-ignore
      return possible[variableName.toLowerCase()];
    }
  }

  const possibleFiltered = Object.values(possible).filter(
    (val) => val !== undefined,
  );
  if (possibleFiltered.length > 0) {
    return possibleFiltered[0];
  }
}
