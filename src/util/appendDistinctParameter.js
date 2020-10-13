export function appendDistinctParameter(values, key, value) {
  key = key && key.toLowerCase();
  if (!values[key]) {
    values[key] = {
      key,
      values: [],
      count: 0,
    };
  }
  if (!values[key].values.includes(value)) {
    values[key].values.push(value);
  }
  values[key].count++;
}
