import { DataXY } from 'cheminfo-types';
import { xyArrayAlign } from 'ml-spectra-processing';

import { Analysis } from '../Analysis';
import { NormalizedSpectrumOptions } from '../types/NormalizedSpectrumOptions';

interface ToMatrixOptions {
  selector?: Record<string, unknown>;
  normalization?: NormalizedSpectrumOptions;
  /**
   * The end of line character
   * @default '\n'
   */
  endOfLine?: string;
  xLabel?: string;
  /**
   * The delta to use for the alignment of the x values
   * @default 0
   */
  delta?: number;
}

/**
 * Generate a jsgraph chart format from an array of Analysis
 * @param analyses
 * @param options
 */
export function toMatrix(analyses: Analysis[], options: ToMatrixOptions = {}) {
  const {
    selector = {},
    normalization,
    xLabel = 'x',
    delta = 0,
    endOfLine = '\n',
  } = options;
  const data: DataXY[] = [];
  const labels: string[] = [xLabel];
  for (const analysis of analyses) {
    const spectra = analysis.getNormalizedSpectra({
      selector,
      normalization,
    });
    for (const spectrum of spectra) {
      labels.push(spectrum.title || '');
      data.push({ x: spectrum.variables.x.data, y: spectrum.variables.y.data });
    }
  }
  const aligned = xyArrayAlign(data, { delta });
  const lines: string[] = [labels.join('\t')];
  for (let row = 0; row < aligned.x.length; row++) {
    const line = [aligned.x[row]];
    for (const column of aligned.ys) {
      line.push(column[row]);
    }
    lines.push(line.join('\t'));
  }
  const text = lines.join(endOfLine);
  return text;
}

// need to find all the unique Xs
