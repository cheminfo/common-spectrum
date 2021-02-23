import type { SelectorType, SpectrumType, VariableType } from '../types';

import { convertUnit } from './convertUnit';
import { ensureRegexp } from './ensureRegexp';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve the spectrum with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 */
export function getXYSpectrum(
  spectra: Array<SpectrumType> = [],
  selector: SelectorType = {},
): SpectrumType | undefined {
  if (spectra.length < 1) return;

  for (let spectrum of spectra) {
    let variableNames = Object.keys(spectrum.variables);
    if (!(variableNames.length > 1)) continue;
    let {
      dataType,
      title,
      xUnits,
      yUnits,
      units,
      labels,
      xLabel,
      yLabel,
      meta,
    } = selector;

    // we filter on generatl spectrum information
    if (dataType) {
      dataType = ensureRegexp(dataType);
      if (!spectrum.dataType || !spectrum.dataType.match(dataType)) continue;
    }

    if (title) {
      title = ensureRegexp(title);
      if (!spectrum.title || !spectrum.title.match(title)) continue;
    }

    if (meta && typeof meta === 'object') {
      if (!spectrum.meta) continue;
      for (let key in spectrum.meta) {
        if (!spectrum.meta[key]) continue;
        let value = ensureRegexp(spectrum.meta[key]);
        if (!spectrum.meta[key].match(value)) continue;
      }
    }

    if (units && !xUnits && !yUnits) [yUnits, xUnits] = units.split(/\s*vs\s*/);
    if (labels && !xLabel && !yLabel) {
      [xLabel, yLabel] = labels.split(/\s*vs\s*/);
    }

    if (xLabel) xLabel = ensureRegexp(xLabel);
    if (yLabel) yLabel = ensureRegexp(yLabel);

    let x = getPossibleVariable(spectrum.variables, {
      units: xUnits,
      label: xLabel,
      variableName: 'x',
    });
    let y = getPossibleVariable(spectrum.variables, {
      units: yUnits,
      label: yLabel,
      variableName: 'y',
    });

    if (x && y) {
      return {
        title: spectrum.title,
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
  variableName?: string;
}
function getPossibleVariable(
  variables: Record<string, VariableType>,
  selector: Selector = {},
) {
  const { units, label, variableName } = selector;
  let possible = { ...variables };
  if (units !== undefined) {
    for (let key in possible) {
      let converted = convertUnit(1, variables[key].units || '', units);
      if (converted) {
        possible[key] = getConvertedVariable(variables[key], units);
      } else {
        possible[key] = undefined;
      }
    }
  }

  if (label !== undefined) {
    for (let key in possible) {
      if (!variables[key].label.match(label)) {
        possible[key] = undefined;
      }
    }
  }

  if (variableName !== undefined) {
    if (possible[variableName]) return possible[variableName];
    if (possible[variableName.toUpperCase()]) {
      return possible[variableName.toUpperCase()];
    }
  }
  if (Object.keys(possible).length > 0) {
    return possible[Object.keys(possible)[0]];
  }
}
