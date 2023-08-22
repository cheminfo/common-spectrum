import { Analysis } from './Analysis';
import { CounterType, DifferentType } from './types/types';
import { appendDistinctParameter } from './util/appendDistinctParameter';
import { appendDistinctValue } from './util/appendDistinctValue';

interface GetAnalysesOptions {
  ids?: string[];
}

export class AnalysesManager {
  public analyses: Analysis[];

  public constructor() {
    this.analyses = [];
  }

  public addAnalysis(analysis: Analysis) {
    const index = this.getAnalysisIndex(analysis.id);
    if (index === undefined) {
      this.analyses.push(analysis);
    } else {
      this.analyses[index] = analysis;
    }
  }

  public getAnalyses(options: GetAnalysesOptions = {}) {
    const { ids } = options;
    const analyses: Analysis[] = [];
    for (const analysis of this.analyses) {
      if (!ids || ids.includes(analysis.id)) {
        analyses.push(analysis);
      }
    }
    return analyses;
  }

  public getSpectra() {
    const spectra = [];
    for (const analysis of this.analyses) {
      spectra.push(...analysis.spectra);
    }
    return spectra;
  }

  public getAnalysisBySpectrumId(id: string) {
    for (const analysis of this.analyses) {
      for (const spectrum of analysis.spectra) {
        if (spectrum.id === id) return analysis;
      }
    }
    return undefined;
  }

  public getSpectrumById(id: string) {
    for (const analysis of this.analyses) {
      for (const spectrum of analysis.spectra) {
        if (spectrum.id === id) return spectrum;
      }
    }
    return undefined;
  }

  /**
   * Get an array of objects (key + count) of all the titles
   */
  public getDistinctTitles() {
    const values: Record<string, CounterType> = {};
    for (const spectrum of this.getSpectra()) {
      if (spectrum.title) {
        appendDistinctValue(values, spectrum.title);
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the units
   */
  public getDistinctUnits() {
    const values: Record<string, CounterType> = {};
    for (const spectrum of this.getSpectra()) {
      if (spectrum.variables) {
        for (const [, variable] of Object.entries(spectrum.variables)) {
          if (variable.units) {
            appendDistinctValue(values, variable.units);
          }
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + unit + label + count) of all the units
   */
  public getDistinctLabelUnits() {
    const values: Record<
      string,
      { key: string; units: string; label: string; count: number }
    > = {};
    for (const spectrum of this.getSpectra()) {
      if (spectrum.variables) {
        for (const [, variable] of Object.entries(spectrum.variables)) {
          const { label, units } = normalizeLabelUnits(
            variable.label,
            variable.units,
          );
          const key = label + (units ? ` (${units})` : '');
          if (key) {
            if (!values[key]) {
              values[key] = { key, units, label, count: 0 };
            }
            values[key].count++;
          }
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the labels
   */
  public getDistinctLabels() {
    const values: Record<string, CounterType> = {};
    for (const spectrum of this.getSpectra()) {
      if (spectrum.variables) {
        for (const [, variable] of Object.entries(spectrum.variables)) {
          appendDistinctValue(values, variable.label.replace(/\s+[[(].*$/, ''));
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the dataTypes
   */
  public getDistinctDataTypes() {
    const values: Record<string, CounterType> = {};
    for (const spectrum of this.getSpectra()) {
      if (spectrum.dataType) {
        appendDistinctValue(values, spectrum.dataType);
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the meta
   */
  public getDistinctMeta() {
    const values: Record<string, DifferentType> = {};
    for (const spectrum of this.getSpectra()) {
      if (spectrum.meta) {
        for (const key in spectrum.meta) {
          appendDistinctParameter(values, key, spectrum.meta[key]);
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  public removeAllAnalyses() {
    this.analyses.splice(0);
  }

  /**
   * Remove the analysis from the AnalysesManager for the specified id
   */
  public removeAnalysis(id: string) {
    const index = this.getAnalysisIndex(id);
    if (index === undefined) return undefined;
    return this.analyses.splice(index, 1);
  }

  /**
   * Returns the index of the analysis in the analyses array
   */
  public getAnalysisIndex(id: string) {
    if (!id) return undefined;
    for (let i = 0; i < this.analyses.length; i++) {
      const analysis = this.analyses[i];
      if (analysis.id === id) return i;
    }
    return undefined;
  }

  /**
   * Checks if the ID of an analysis exists in the AnalysesManager
   */
  public includes(id: string) {
    const index = this.getAnalysisIndex(id);
    return index === undefined ? false : !isNaN(index);
  }
}

function normalizeLabelUnits(
  originalLabel: string,
  originalUnits: string,
): { units: string; label: string } {
  if (!originalLabel) {
    return { units: '', label: '' };
  }
  if (originalLabel.search(/[[(]]/) >= 0) {
    const [units, label] = originalLabel.split(/\s*[[(]/);
    return { units: originalUnits || units, label };
  }
  return { label: originalLabel, units: originalUnits };
}
