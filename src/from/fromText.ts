import { MeasurementXYVariables } from 'cheminfo-types';
import { parseXYAndKeepInfo, ParseXYOptions } from 'xy-parser';

import { Analysis } from '../Analysis';

interface FromTextOptions {
  /**
   * @default {}
   */
  info?: {
    /**
     * Units for the x axis
     * @default '''
     */
    xUnits?: string;
    /**
     * Label for the x axis
     * @default '''
     */
    xLabel?: string;
    /**
     * Units for the y axis
     * @default '''
     */
    yUnits?: string;
    /**
     * Label for the y axis
     * @default '''
     */
    yLabel?: string;
  };
  parser?: ParseXYOptions;
}

/**
 * Convert strings into JCAMP and add extra information
 * @param {string} data - values to add to the file, usually a csv or tsv values
 */

export function fromText(
  data: string | ArrayBuffer,
  options: FromTextOptions = {},
): Analysis {
  let analysis = new Analysis();

  const { info = {}, parser = {} } = options;

  let parsed = parseXYAndKeepInfo(data, parser);
  const variables: MeasurementXYVariables = {
    x: {
      data: parsed.data.x,
      units: info.xUnits || '',
      label: info.xLabel || '',
    },
    y: {
      data: parsed.data.y,
      units: info.yUnits || '',
      label: info.yLabel || '',
    },
  };

  analysis.pushSpectrum(variables);

  return analysis;
}
