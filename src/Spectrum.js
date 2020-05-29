import getNormalized from './util/getNormalized';

/**
 * Class allowing to store and manipulate a spectrum
 * @class Spectrum
 * @param {object} [options={}]
 * @param {string} [options.id=randomString] unique identifier
 * @param {string} [options.label] human redeable label
 */
export class Spectrum {
  constructor(options = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 10);
    this.label = options.label || this.id;
    this.flavors = {};
    this.defaultFlavor =
      options.defaultFlavor === undefined ? '' : options.defaultFlavor;
  }

  set(points, options = {}) {
    const { flavor = this.defaultFlavor } = options;
    this.flavors[flavor.toLowerCase()] = standardizeData(points, options);
  }

  get(flavor = this.defaultFlavor) {
    flavor = flavor.toLowerCase();
    if (!this.flavors[flavor]) {
      return undefined;
    }
    return this.flavors[flavor];
  }

  getData(options = {}) {
    const { flavor, normalization } = options;
    let data = this.get(flavor);
    if (!data) return undefined;
    return getNormalized(data, normalization);
  }

  getXLabel(flavor) {
    return this.get(flavor).xLabel;
  }

  getYLabel(flavor) {
    return this.get(flavor).yLabel;
  }
}

function standardizeData(points, options = {}) {
  const { meta = {}, tmp = {}, xLabel = '', yLabel = '', title = '' } = options;
  let { x, y } = points;
  if (x && x.length > 1 && x[0] > x[x.length - 1]) {
    x = x.reverse();
    y = y.reverse();
  } else {
    x = x || [];
    y = y || [];
  }
  points = { x, y };

  return {
    x: points.x,
    y: points.y,
    xLabel,
    yLabel,
    title,
    meta,
    tmp,
  };
}
