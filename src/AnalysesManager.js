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
