/* eslint-disable @typescript-eslint/no-dynamic-delete */

import type {
  OneLowerCase,
  Spectrum,
  SpectrumVariables,
} from '../types/Cheminfo';
import { SpectrumSelector } from '../types/SpectrumSelector';

import { convertUnit } from './convertUnit';
import { ensureRegexp } from './ensureRegexp';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve the spectrum with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 */
export function getXYSpectra(
  spectra: Array<Spectrum> = [],
  selector: SpectrumSelector = {},
): Spectrum[] {
  const selectedSpectra: Spectrum[] = [];

  if (spectra.length < 1) return selectedSpectra;

  let {
    dataType,
    title,
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
    return [spectra[index]];
  }

  if (dataType) {
    dataType = ensureRegexp(dataType);
  }

  if (title) {
    title = ensureRegexp(title);
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
      if (!spectrum.dataType || !(dataType as RegExp).exec(spectrum.dataType)) {
        continue;
      }
    }

    if (title) {
      if (!spectrum.title || !(title as RegExp).exec(spectrum.title)) {
        continue;
      }
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
      selectedSpectra.push({
        title: spectrum.title,
        dataType: spectrum.dataType,
        meta: spectrum.meta,
        variables: { x, y },
      });
    }
  }
  return selectedSpectra;
}

interface Selector {
  units?: string;
  label?: string | RegExp;
  variableName?: OneLowerCase;
}
function getPossibleVariable(
  variables: SpectrumVariables,
  selector: Selector = {},
) {
  const { units, label, variableName } = selector;
  let possible: SpectrumVariables = { ...variables };
  let key: keyof typeof possible;
  if (units !== undefined) {
    for (key in possible) {
      const variable = variables[key];
      let convertibleUnits = true;
      try {
        convertUnit(1, variable?.units || '', units);
      } catch (e) {
        convertibleUnits = false;
      }
      if (convertibleUnits && variable) {
        possible[key] = getConvertedVariable(variable, units);
      } else {
        delete possible[key];
      }
    }
  }

  if (label !== undefined) {
    const regexpLabel = ensureRegexp(label);
    for (key in possible) {
      if (!regexpLabel.exec(variables[key]?.label ?? '')) {
        delete possible[key];
      }
    }
  }

  if (variableName !== undefined) {
    if (possible[variableName]) return possible[variableName];
    const upper = variableName.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(possible, upper)) {
      return possible[upper as keyof typeof possible];
    }
    const lower = variableName.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(possible, lower)) {
      return possible[lower as keyof typeof possible];
    }
  }

  const possibleFiltered = Object.values(possible).filter(
    (val) => val !== undefined,
  );
  if (possibleFiltered.length > 0) {
    return possibleFiltered[0];
  }
}
