import { AnalysesManager } from '../AnalysesManager';
import { Analysis } from '../Analysis';

describe('AnalysisManager', () => {
  it('check add / remove', () => {
    const spectraManager = new AnalysesManager();
    const analysis = new Analysis({ id: 'abc' });
    spectraManager.addAnalysis(analysis);
    expect(spectraManager.analyses).toHaveLength(1);
    expect(spectraManager.getAnalysisIndex('abc')).toBe(0);
    spectraManager.addAnalysis(analysis);
    expect(spectraManager.analyses).toHaveLength(1);
    const analysis2 = new Analysis({ id: 'def' });
    spectraManager.addAnalysis(analysis2);
    expect(spectraManager.analyses).toHaveLength(2);
    expect(spectraManager.getAnalysisIndex('def')).toBe(1);
    spectraManager.removeAnalysis('abc');
    expect(spectraManager.analyses).toHaveLength(1);
    expect(spectraManager.getAnalysisIndex('def')).toBe(0);
    spectraManager.addAnalysis(analysis);
    expect(spectraManager.analyses).toHaveLength(2);
    spectraManager.removeAllAnalyses();
    expect(spectraManager.analyses).toHaveLength(0);
  });

  it('check toJSON / fromJSON', () => {
    const spectraManager = new AnalysesManager();
    const analysis = new Analysis({ id: 'abc' });
    spectraManager.addAnalysis(analysis);
    const analysis2 = new Analysis({ id: 'def' });
    spectraManager.addAnalysis(analysis2);

    const json = JSON.parse(JSON.stringify(spectraManager));

    const spectraManager2 = AnalysesManager.fromJSON(json);

    expect(spectraManager2.analyses).toHaveLength(2);
    expect(typeof spectraManager2.analyses[0].getNormalizedSpectra).toBe(
      'function',
    );
  });
});
