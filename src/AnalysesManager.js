import { appendDistinctParameter } from './util/appendDistinctParameter';
import { appendDistinctValue } from './util/appendDistinctValue';

export class AnalysesManager {
  constructor() {
    this.analyses = [];
  }

  addAnalysis(analysis) {
    let index = this.getAnalysisIndex(analysis.id);
    if (index === undefined) {
      this.analyses.push(analysis);
    } else {
      this.analyses[index] = analysis;
    }
  }

  getAnalyses(options = {}) {
    const { ids } = options;
    let analyses = [];
    for (const analysis of this.analyses) {
      if (!ids || ids.includes(analysis.id)) {
        analyses.push(analysis);
      }
    }
    return analyses;
  }

  getSpectra() {
    const spectra = [];
    for (const analysis of this.analyses) {
      spectra.push(...analysis.spectra);
    }
    return spectra;
  }

  /**
   * Get an array of objects (key + count) of all the titles
   */
  getDistinctTitles() {
    let values = {};
    for (let spectrum of this.getSpectra()) {
      appendDistinctValue(values, spectrum.title);
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the units
   */
  getDistinctUnits() {
    let values = {};
    for (let spectrum of this.getSpectra()) {
      if (spectrum.variables) {
        for (let key in spectrum.variables) {
          appendDistinctValue(
            values,
            spectrum.variables[key].units.replace(/\s+\[.*/, ''),
          );
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the labels
   */
  getDistinctLabels() {
    let values = {};
    for (let spectrum of this.getSpectra()) {
      if (spectrum.variables) {
        for (let key in spectrum.variables) {
          appendDistinctValue(
            values,
            spectrum.variables[key].label.replace(/\s+\[.*/, ''),
          );
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the dataTypes
   */
  getDistinctDataTypes() {
    let values = {};
    for (let spectrum of this.getSpectra()) {
      appendDistinctValue(values, spectrum.dataType);
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the meta
   */
  getDistinctMeta() {
    let values = {};
    for (let spectrum of this.getSpectra()) {
      if (spectrum.meta) {
        for (let key in spectrum.meta) {
          appendDistinctParameter(values, key, spectrum.meta[key]);
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  removeAllAnalyses() {
    this.analyses.splice(0);
  }

  /**
   * Remove the analysis from the AnalysesManager for the specified id
   * @param {string} id
   */
  removeAnalysis(id) {
    let index = this.getAnalysisIndex(id);
    if (index === undefined) return undefined;
    return this.analyses.splice(index, 1);
  }

  /**
   * Returns the index of the analysis in the analyses array
   * @param {string} id
   * @returns {number}
   */
  getAnalysisIndex(id) {
    if (!id) return undefined;
    for (let i = 0; i < this.analyses.length; i++) {
      let analysis = this.analyses[i];
      if (analysis.id === id) return i;
    }
    return undefined;
  }

  /**
   * Checks if the ID of an analysis exists in the AnalysesManager
   * @param {string} id
   */
  includes(id) {
    return !isNaN(this.getAnalysisIndex(id));
  }
}
