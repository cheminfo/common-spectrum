import Qty from 'js-quantities';

// overloads for typing correct values
export function convertUnit(
  array: number[],
  fromUnit: string,
  toUnit: string,
): number[] | undefined;
export function convertUnit(
  array: number,
  fromUnit: string,
  toUnit: string,
): number | undefined;

export function convertUnit(
  array: any,
  fromUnit: string,
  toUnit: string,
): any | undefined {
  fromUnit = normalize(fromUnit);
  toUnit = normalize(toUnit);

  if (fromUnit === toUnit) return array;

  try {
    const convert = Qty.swiftConverter(fromUnit, toUnit); // Configures converter
    return convert(array);
  } catch (e) {
    return undefined;
  }
}

function normalize(unit: string) {
  unit = unit.replace(/°C/g, 'tempC');
  unit = unit.replace(/°F/g, 'tempF');
  unit = unit.replace(/(^|\W)K(\W|$)/g, '$1tempK$2');
  return unit;
}
