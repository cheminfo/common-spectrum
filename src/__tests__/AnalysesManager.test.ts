import { AnalysesManager } from '../AnalysesManager';
import { Analysis } from '../Analysis';

describe('AnalysisManager', () => {
  it('check add / remove', () => {
    const analysesManager = new AnalysesManager();
    const analysis = new Analysis({ id: 'abc' });
    analysesManager.addAnalysis(analysis);
    expect(analysesManager.analyses).toHaveLength(1);
    expect(analysesManager.getAnalysisIndex('abc')).toBe(0);
    analysesManager.addAnalysis(analysis);
    expect(analysesManager.analyses).toHaveLength(1);
    const analysis2 = new Analysis({ id: 'def' });
    analysesManager.addAnalysis(analysis2);
    expect(analysesManager.analyses).toHaveLength(2);
    expect(analysesManager.getAnalysisIndex('def')).toBe(1);
    analysesManager.removeAnalysis('abc');
    expect(analysesManager.analyses).toHaveLength(1);
    expect(analysesManager.getAnalysisIndex('def')).toBe(0);
    analysesManager.addAnalysis(analysis);
    expect(analysesManager.analyses).toHaveLength(2);
    analysesManager.removeAllAnalyses();
    expect(analysesManager.analyses).toHaveLength(0);
  });

  it('check getAnalyses', () => {
    const analysesManager = new AnalysesManager();
    const analysis = new Analysis({ id: 'abc' });
    analysis.pushSpectrum(
      {
        x: { data: Float64Array.from([1, 2, 3]), label: 'x' },
        y: { data: [1, 2, 3], label: 'y' },
      },
      { id: 'klm' },
    );
    analysis.pushSpectrum(
      {
        x: { data: [2, 3, 4], label: 'x' },
        y: { data: [2, 3, 4], label: 'y' },
      },
      { id: 'nop' },
    );
    analysesManager.addAnalysis(analysis);
    const analysis2 = new Analysis({ id: 'def' });
    analysis2.pushSpectrum(
      {
        x: { data: Float64Array.from([1, 2, 3]), label: 'x' },
        y: { data: [1, 2, 3], label: 'y' },
      },
      { id: 'qrs' },
    );
    analysesManager.addAnalysis(analysis2);
    const analysis3 = new Analysis({ id: 'ghi' });
    analysesManager.addAnalysis(analysis3);
    const analyses = analysesManager.getAnalyses();
    expect(analyses).toHaveLength(3);
    // we expect to have a total of 3 spectra without filtereing
    expect(analyses.map((analysis) => analysis.spectra).flat()).toHaveLength(3);

    // we select the first analysis, we expect to have 2 spectra
    const filteredAnalyses = analysesManager.getAnalyses({ ids: ['abc'] });
    expect(filteredAnalyses).toHaveLength(1);
    expect(filteredAnalyses[0].spectra).toHaveLength(2);

    // we can also filter by spectrum id
    const filteredAnalysesSpectra = analysesManager.getAnalyses({
      ids: ['klm'],
    });
    expect(filteredAnalysesSpectra).toHaveLength(1);
    expect(filteredAnalysesSpectra[0].spectra).toHaveLength(1);
  });

  it('check toJSON / fromJSON', () => {
    const analysesManager = new AnalysesManager();
    const analysis = new Analysis({ id: 'abc' });
    analysis.pushSpectrum({
      x: { data: Float64Array.from([1, 2, 3]), label: 'x' },
      y: { data: [1, 2, 3], label: 'y' },
    });
    analysesManager.addAnalysis(analysis);
    const analysis2 = new Analysis({ id: 'def' });
    analysesManager.addAnalysis(analysis2);

    const json = JSON.parse(JSON.stringify(analysesManager));
    const data = json.analyses[0].spectra[0].variables.x.data;
    expect(Array.isArray(data)).toBe(true);
    const spectraManager2 = AnalysesManager.fromJSON(json);

    expect(spectraManager2.analyses).toHaveLength(2);
    expect(typeof spectraManager2.analyses[0].getNormalizedSpectra).toBe(
      'function',
    );
  });
});
