export function enforceSorted(
  x: number[] | Float64Array,
  y: number[] | Float64Array,
): [number[], number[]] {
  let prevX = -Infinity;
  let ansX: number[] = [];
  let ansY: number[] = [];

  for (let index = 0; index < x.length; index++) {
    if (prevX < x[index]) {
      ansX.push(x[index]);
      ansY.push(y[index]);
      prevX = x[index];
    }
  }
  return [ansX, ansY];
}
