const testRegExp = /^\/((?:\\\/|[^/])+)\/([migyu]{0,5})?$/;

export function ensureRegexp(string: any) {
  const parts = testRegExp.exec(string);
  if (parts) {
    try {
      return new RegExp(parts[1], parts[2]);
    } catch (err) {
      return stringToRegexp(string);
    }
  } else {
    return stringToRegexp(string);
  }
}

function stringToRegexp(string: any, flags = 'i') {
  return new RegExp(
    string.replace(/[[\]\\{}()+*?.$^|]/g, (match: string) => `\\${match}`),
    flags,
  );
}
