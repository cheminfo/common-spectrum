import type { DifferentType } from '../types/types.js';

export function appendDistinctParameter(
  values: Record<string, DifferentType>,
  key: string,
  value: string,
) {
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
