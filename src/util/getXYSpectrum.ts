import type {
  OneLowerCase,
  MeasurementXY,
  MeasurementXYVariables,
} from 'cheminfo-types';

import { SpectrumSelector } from '../types/SpectrumSelector';

import { convertUnit } from './convertUnit';
import { ensureRegexp } from './ensureRegexp';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve the spectrum with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 */
export function getXYSpectrum(
  spectra: Array<MeasurementXY> = [],
  selector: SpectrumSelector = {},
): MeasurementXY | undefined {
  if (spectra.length < 1) return;

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
    return spectra[index];
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

  for (let spectrum of spectra) {
    let variableNames = Object.keys(spectrum.variables);
    if (!(variableNames.length > 1)) continue;

    // we filter on general spectrum information
    if (dataType) {
      if (!spectrum.dataType || !spectrum.dataType.match(dataType)) continue;
    }

    if (description) {
      if (!spectrum.description || !spectrum.description.match(description))
        continue;
    }

    if (meta && typeof meta === 'object') {
      if (!spectrum.meta) continue;
      for (let key in spectrum.meta) {
        if (!spectrum.meta[key]) continue;
        let value = ensureRegexp(spectrum.meta[key]);
        if (!value.exec(spectrum.meta[key])) continue;
      }
    }

    let x = getPossibleVariable(spectrum.variables, {
      units: xUnits,
      label: xLabel,
      variableName: xVariable,
    });
    let y = getPossibleVariable(spectrum.variables, {
      units: yUnits,
      label: yLabel,
      variableName: yVariable,
    });

    if (x && y) {
      return {
        description: spectrum.description,
        dataType: spectrum.dataType,
        meta: spectrum.meta,
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
