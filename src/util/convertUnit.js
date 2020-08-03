import Qty from 'js-quantities';

export function convertUnit(array, fromUnit, toUnit) {
  fromUnit = normalize(fromUnit);
  toUnit = normalize(toUnit);
  try {
    const convert = Qty.swiftConverter(fromUnit, toUnit); // Configures converter
    return convert(array);
  } catch (e) {
    return undefined;
  }
}

function normalize(unit) {
  unit = unit.replace(/°C/g, 'tempC');
  unit = unit.replace(/°F/g, 'tempF');
  unit = unit.replace(/(^|\W)K(\W|$)/g, '$1tempK$2');
  return unit;
}
