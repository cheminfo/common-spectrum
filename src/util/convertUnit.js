import Qty from 'js-quantities';

export function convertUnit(array, fromUnit, toUnit) {
  try {
    const convert = Qty.swiftConverter(fromUnit, toUnit); // Configures converter
    return convert(array);
  } catch (e) {
    return undefined;
  }
}
