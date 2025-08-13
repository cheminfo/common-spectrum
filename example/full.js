/* eslint-disable no-console */
import { CommonSpectrum } from 'common-spectrum';

const { Analysis, fromJcamp, toJcamp, getNormalized, getJSGraph } =
  new CommonSpectrum({
    dataType: 'TGA', // type of analysis like TGA for 'Thermal Gravitational Analysis'
    defaultFlavor: 'myFlavor', // default flavor when adding a spectrum
  });

// we create an analysis that has no spectrum
let analysis = new Analysis();

// we add a spectrum with the default flavor
analysis.set(
  { x: [1, 2], y: [3, 4] },
  {
    xLabel: 'X axis',
    yLabel: 'Y axis',
    title: 'My spectrum',
    meta: {
      // unlimited number of meta information is allowed
      meta1: 'Meta 1',
      meta2: 'Meta 2',
    },
  },
);

// if we want to retrive the default flavor spectrum, no
// parameter is needed
let defaultFlavorSpectrum = analysis.get();

// the data of a spectrum can be normalized using various options
let data = getNormalized(defaultFlavorSpectrum, {
  filters: [{ name: 'normalize' }],
});
console.log(data);

// In order to plot the data we can use JsGraph and this method generates
// the json format required by this library
// It allows to superimpose an unlimited number of spectra.
let jsgraph = getJSGraph([analysis]);
console.log(jsgraph);

// It is possible to save the analysis as a JCAMP-DX
let jcamp = toJcamp(analysis);

// The analysis object can be recreated from a JCAMP-DX text file as well.
let analysisFromJcamp = fromJcamp(jcamp);
console.log(analysisFromJcamp);
