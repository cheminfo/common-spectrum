import { parseXY } from 'xy-parser';

import { Analysis } from '../Analysis';

/**
 * Convert strings into JCAMP and add extra information
 * @param {string} data - values to add to the file, usually a csv or tsv values
 * @param {object} [options={}]
 * @param {string} [options.info={}] - metadata of the file
 * @param {string} [options.info.title = ''] - title of the file
 * @param {string} [options.info.dataType = ''] - type of data
 * @param {string} [options.info.xUnits = ''] - units for the x axis
 * @param {string} [options.info.yUnits = ''] - units for the y axis
 * @param {string} [options.info.xLabel = ''] - label for the x axis
 * @param {string} [options.info.yLabel = ''] - label for the y axis
 * @param {object} [options.meta = {}] - comments to add to the file
 * @param {object} [options.parser = {}] - 'xy-parser' options. arrayType = 'xyxy' is enforced
 * @return {string} JCAMP of the input
 */

export function fromText(data: string | ArrayBuffer, options = {}): Analysis {
  let analysis = new Analysis(options);

  const { info = {}, parser = {} } = options;

  parser.keepInfo = true;
  let parsed = parseXY(data, parser);
  const variables = {
    x: {
      data: parsed.data.x,
      units: info.xUnits,
      label: info.xLabel,
    },
    y: {
      data: parsed.data.y,
      units: info.yUnits,
      label: info.yLabel,
    },
  };

  analysis.pushSpectrum(variables, options);

  return analysis;
}
