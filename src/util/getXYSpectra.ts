/* eslint-disable @typescript-eslint/no-dynamic-delete */

import type {
  MeasurementXY,
  MeasurementXYVariables,
  OneLowerCase,
} from 'cheminfo-types';

import type { SpectrumSelector } from '../types/SpectrumSelector.js';

import { convertUnit } from './convertUnit.js';
import { ensureRegexp } from './ensureRegexp.js';
import { getConvertedVariable } from './getConvertedVariable.js';

/**
 * Retrieve the spectrum with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 * @param spectra
 * @param selector
 */
export function getXYSpectra(
  spectra: MeasurementXY[] = [],
  selector: SpectrumSelector = {},
): MeasurementXY[] {
  const selectedSpectra: MeasurementXY[] = [];

  if (spectra.length === 0) return selectedSpectra;

  const { variables, units, labels, meta, index } = selector;

  let {
    dataType,
    title,
    xUnits,
    yUnits,
    xVariable = 'x',
    yVariable = 'y',
    xLabel,
    yLabel,
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

  for (const spectrum of spectra) {
    const variableNames = Object.keys(spectrum.variables);
    if (!(variableNames.length > 1)) continue;

    // we filter on general spectrum information
    if (
      dataType &&
      (!spectrum.dataType || !(dataType as RegExp).exec(spectrum.dataType))
    ) {
      continue;
    }

    if (title && (!spectrum.title || !(title as RegExp).exec(spectrum.title))) {
      continue;
    }

    if (meta && typeof meta === 'object') {
      if (!spectrum.meta) continue;
      for (const key in spectrum.meta) {
        if (!spectrum.meta[key]) continue;
        const value = ensureRegexp(spectrum.meta[key]);
        if (!value.exec(spectrum.meta[key])) continue;
      }
    }

    const x = getPossibleVariable(spectrum.variables, {
      units: xUnits,
      label: xLabel,
      variableName: xVariable,
    });
    const y = getPossibleVariable(spectrum.variables, {
      units: yUnits,
      label: yLabel,
      variableName: yVariable,
    });

    if (x && y) {
      // should we reverse the x axis?
      if (x.data[0] > x.data.at(-1)) {
        x.data = x.data.slice().reverse();
        y.data = y.data.slice().reverse();
      }
      selectedSpectra.push({
        title: spectrum.title,
        dataType: spectrum.dataType,
        meta: spectrum.meta,
        variables: { x, y },
        id: spectrum.id,
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
  variables: MeasurementXYVariables,
  selector: Selector = {},
) {
  const { units, label, variableName } = selector;
  const possible: MeasurementXYVariables = { ...variables };
  let key: keyof typeof possible;
  if (units !== undefined) {
    for (key in possible) {
      const variable = variables[key];
      let convertibleUnits = true;
      try {
        convertUnit(1, variable?.units || '', units);
      } catch {
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
    if (Object.hasOwn(possible, upper)) {
      return possible[upper as keyof typeof possible];
    }
    const lower = variableName.toLowerCase();
    if (Object.hasOwn(possible, lower)) {
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
