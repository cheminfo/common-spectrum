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
    let index = this.getAnalysisIndex(analysis.id);
    if (index === undefined) {
      this.analyses.push(analysis);
    } else {
      this.analyses[index] = analysis;
    }
  }

  public getAnalyses(options: GetAnalysesOptions = {}) {
    const { ids } = options;
    let analyses: Analysis[] = [];
    for (const analysis of this.analyses) {
      if (!ids || ids.includes(analysis.id)) {
        analyses.push(analysis);
      }
    }
    return analyses;
  }

  public getSpectra() {
    const measurements = [];
    for (const analysis of this.analyses) {
      measurements.push(...analysis.measurements);
    }
    return measurements;
  }

  /**
   * Get an array of objects (key + count) of all the titles
   */
  public getDistinctTitles() {
    let values: Record<string, CounterType> = {};
    for (let measurement of this.getSpectra()) {
      if (measurement.description) {
        appendDistinctValue(values, measurement.description);
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the units
   */
  public getDistinctUnits() {
    let values: Record<string, CounterType> = {};
    for (let measurement of this.getSpectra()) {
      if (measurement.variables) {
        for (let [, variable] of Object.entries(measurement.variables)) {
          const units = variable.units?.replace(/\s+\[.*/, '');
          if (units) {
            appendDistinctValue(values, units);
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
    let values: Record<string, CounterType> = {};
    for (let measurement of this.getSpectra()) {
      if (measurement.variables) {
        for (let [, variable] of Object.entries(measurement.variables)) {
          appendDistinctValue(values, variable.label.replace(/\s+\[.*/, ''));
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the dataTypes
   */
  public getDistinctDataTypes() {
    let values: Record<string, CounterType> = {};
    for (let measurement of this.getSpectra()) {
      if (measurement.dataType) {
        appendDistinctValue(values, measurement.dataType);
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the meta
   */
  public getDistinctMeta() {
    let values: Record<string, DifferentType> = {};
    for (let measurement of this.getSpectra()) {
      if (measurement.meta) {
        for (let key in measurement.meta) {
          appendDistinctParameter(values, key, measurement.meta[key]);
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
    let index = this.getAnalysisIndex(id);
    if (index === undefined) return undefined;
    return this.analyses.splice(index, 1);
  }

  /**
   * Returns the index of the analysis in the analyses array
   */
  public getAnalysisIndex(id: string) {
    if (!id) return undefined;
    for (let i = 0; i < this.analyses.length; i++) {
      let analysis = this.analyses[i];
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
