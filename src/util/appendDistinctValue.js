export function appendDistinctValue(values, key) {
  if (!values[key]) {
    values[key] = {
      key,
      count: 0,
    };
  }
  values[key].count++;
}
