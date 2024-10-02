const testRegExp = /^\/((?:\\\/|[^/])+)\/([gimuy]{0,5})?$/;

export function ensureRegexp(string: string | RegExp): RegExp {
  if (typeof string !== 'string') return string;
  const parts = testRegExp.exec(string);
  if (parts) {
    try {
      return new RegExp(parts[1], parts[2]);
    } catch {
      return stringToRegexp(string);
    }
  } else {
    return stringToRegexp(string);
  }
}

function stringToRegexp(string: string, flags = 'i') {
  return new RegExp(
    string.replaceAll(/[$()*+.?[\\\]^{|}]/g, (match: string) => `\\${match}`),
    flags,
  );
}
