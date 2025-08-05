import { Analysis } from './Analysis';
import type { CounterType, DifferentType } from './types/types';
import { appendDistinctParameter } from './util/appendDistinctParameter';
import { appendDistinctValue } from './util/appendDistinctValue';

interface GetAnalysesOptions {
  /**
   * Array of ids to filter the analyses. The ids could be either the analysis id or the spectrum id
   * If it mathces the analysis id, all the spectra of the analysis will be included
   * If it matches the spectrum id, only the spectrum will be included
   */
  ids?: string[];
}

export class AnalysesManager {
  public analyses: Analysis[];

  public constructor() {
    this.analyses = [];
  }

  static fromJSON(json: any) {
    const analysesManager = new AnalysesManager();
    for (const analysis of json.analyses) {
      analysesManager.analyses.push(Analysis.fromJSON(analysis));
    }
    return analysesManager;
  }

  public addAnalysis(analysis: Analysis) {
    const index = this.getAnalysisIndex(analysis.id);
    if (index === undefined) {
      this.analyses.push(analysis);
    } else {
      this.analyses[index] = analysis;
    }
  }

  /**
   *
   * @param options
   * @returns
   */
  public getAnalyses(options: GetAnalysesOptions = {}) {
    const { ids } = options;
    const analyses: Analysis[] = [];
    const processedAnalysisIds = new Set<string>();
    for (const analysis of this.analyses) {
      if (!ids || ids.includes(analysis.id)) {
        analyses.push(analysis);
        processedAnalysisIds.add(analysis.id);
        continue;
      }
      for (const spectrum of analysis.spectra) {
        if (
          spectrum.id &&
          ids.includes(spectrum.id) &&
          !processedAnalysisIds.has(analysis.id)
        ) {
          analyses.push(analysis.clone({ filter: { ids } }));
          processedAnalysisIds.add(analysis.id);
        }
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
          appendDistinctValue(values, variable.label.replace(/\s+[([].*$/, ''));
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
   * @param id
   */
  public removeAnalysis(id: string) {
    const index = this.getAnalysisIndex(id);
    if (index === undefined) return undefined;
    return this.analyses.splice(index, 1);
  }

  /**
   * Returns the index of the analysis in the analyses array
   * @param id
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
   * @param id
   */
  public includes(id: string) {
    const index = this.getAnalysisIndex(id);
    return index === undefined ? false : !Number.isNaN(index);
  }
}

function normalizeLabelUnits(
  originalLabel: string,
  originalUnits: string,
): { units: string; label: string } {
  if (!originalLabel) {
    return { units: '', label: '' };
  }
  if (originalLabel.search(/[([]]/) >= 0) {
    const [units, label] = originalLabel.split(/\s*[([]/);
    return { units: originalUnits || units, label };
  }
  return { label: originalLabel, units: originalUnits };
}
