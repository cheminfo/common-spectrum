import type { DoubleArray } from 'cheminfo-types';
import Qty from 'js-quantities';

// overloads for typing correct values
export function convertUnit(
  array: DoubleArray,
  fromUnit: string,
  toUnit: string,
): DoubleArray;
export function convertUnit(
  array: number,
  fromUnit: string,
  toUnit: string,
): number;

export function convertUnit<T extends DoubleArray | number>(
  array: T,
  fromUnit: string,
  toUnit: string,
): T {
  fromUnit = normalize(fromUnit);
  toUnit = normalize(toUnit);

  if (fromUnit === toUnit) return array;

  const convert = Qty.swiftConverter(fromUnit, toUnit); // Configures converter
  //@ts-expect-error convert does not allowed typed array but it works
  return convert(array);
}

function normalize(unit: string) {
  unit = unit.replaceAll('°C', 'tempC');
  unit = unit.replaceAll('°F', 'tempF');
  unit = unit.replaceAll(/(^|\W)K(\W|$)/g, '$1tempK$2');
  return unit;
}
