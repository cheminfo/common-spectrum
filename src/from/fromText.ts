import type {
  MeasurementXY,
  MeasurementXYVariables,
  TextData,
} from 'cheminfo-types';
import type { ParseXYOptions } from 'xy-parser';
import { parseXYAndKeepInfo } from 'xy-parser';

import { Analysis } from '../Analysis.js';

export interface FromTextOptions extends Pick<
  MeasurementXY,
  'dataType' | 'title'
> {
  /**
   * @default {}
   */
  info?: {
    /**
     * Units for the x axis
     * @default ''
     */
    xUnits?: string;
    /**
     * Label for the x axis
     * @default ''
     */
    xLabel?: string;
    /**
     * Units for the y axis
     * @default ''
     */
    yUnits?: string;
    /**
     * Label for the y axis
     * @default ''
     */
    yLabel?: string;
  };
  parser?: ParseXYOptions;
}

/**
 * Convert strings into JCAMP and add extra information
 * @param data - values to add to the file, usually a csv or tsv values
 * @param options
 */

export function fromText(
  data: TextData,
  options: FromTextOptions = {},
): Analysis {
  const analysis = new Analysis();

  const { info = {}, parser = {}, ...measurementOptions } = options;

  const parsed = parseXYAndKeepInfo(data, parser);
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

  analysis.pushSpectrum(variables, measurementOptions);

  return analysis;
}
