const testRegExp = /^\/((?:\\\/|[^/])+)\/([migyu]{0,5})?$/;

export function ensureRegexp(string) {
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

function stringToRegexp(string, flags = 'i') {
  return new RegExp(
    string.replace(/[[\]\\{}()+*?.$^|]/g, function (match) {
      return `\\${match}`;
    }),
    flags,
  );
}
