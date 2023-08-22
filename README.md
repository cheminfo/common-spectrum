# common-spectrum

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Common package to deal with spectral analysis.

An `Analysis` may be composed of many `Spectrum` of different flavors.

By default the flavor is an empty string and if your analysis only generates
one spectrum you may forget this level of complexity.

In the case of Thermogravitaional Analysis (TGA) we may have 2 flavor for the data:

- Weight versus Temperature
- Weight versus Time

This package allow to load / save an Analysis as a JCAMP-DX text file.

## Installation

`$ npm i common-spectrum`

## Usage

```js
import { Analysis, fromJcamp, toJcamp, getJSGraph } from '..';

let analysis = new Analysis();
expect(analysis.id).toHaveLength(8);

analysis.pushSpectrum(
  { x: [1, 2], y: [3, 4] },
  {
    xUnits: 'xUnits',
    yUnits: 'yUnits',
    xLabel: 'X axis',
    yLabel: 'Y axis',
    title: 'My spectrum',
    dataType: 'TGA',
    meta: {
      meta1: 'Meta 1',
      meta2: 'Meta 2',
    },
  },
);

let firstSpectrum = analysis.getSpectrum();

let normalized = analysis.getNormalizedData({
  normalization: {
    filters: [{ name: 'normalize' }],
  },
});

let jsgraph = getJSGraph([analysis]);

let jcamp = toJcamp(analysis, {
  info: {
    owner: 'cheminfo',
    origin: 'Common Spectrum',
  },
});

let analysis2 = fromJcamp(jcamp);
```

## [API Documentation](https://cheminfo.github.io/common-spectrum/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/common-spectrum.svg
[npm-url]: https://www.npmjs.com/package/common-spectrum
[ci-image]: https://github.com/cheminfo/common-spectrum/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/common-spectrum/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/common-spectrum.svg
[codecov-url]: https://codecov.io/gh/cheminfo/common-spectrum
[download-image]: https://img.shields.io/npm/dm/common-spectrum.svg
[download-url]: https://www.npmjs.com/package/common-spectrum
