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

  /**
   * Returns an array of Analysis, by default all
   * @param {object} [options={}]
   * @param {array} [options.ids] Array of ids of spectra to select
   */
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

  /**
   * Returns the analysis with specified id or the first analysis if unspecified
   * @param {object} [options={}]
   * @param {string} [options.id] id of the analysis to select
   */
  getAnalysis(options = {}) {
    const { id } = options;
    if (id) {
      let index = this.getAnalysisIndex(id);
      if (index === undefined) return undefined;
      return this.analyses[index];
    }
    return this.analyses[0];
  }

  removeAllAnalyses() {
    this.analyses.length = 0;
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
