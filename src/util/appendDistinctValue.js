export function appendDistinctValue(values, key) {
  key = key && key.toLowerCase();
  if (!values[key]) {
    values[key] = {
      key,
      count: 0,
    };
  }
  values[key].count++;
}
