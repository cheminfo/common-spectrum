import { AnalysesManager } from '../AnalysesManager';
import { Analysis } from '../Analysis';

describe('spectraManager', () => {
  const spectraManager = new AnalysesManager();
  it('check add / remove', () => {
    let analysis = new Analysis({ id: 'abc' });
    spectraManager.addAnalysis(analysis);
    expect(spectraManager.analyses).toHaveLength(1);
    expect(spectraManager.getAnalysisIndex('abc')).toBe(0);
    spectraManager.addAnalysis(analysis);
    expect(spectraManager.analyses).toHaveLength(1);
    let analysis2 = new Analysis({ id: 'def' });
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
});
