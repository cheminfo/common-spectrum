import { fromJcamp, getJSGraph, AnalysesManager } from '../src';

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

let jcamp = readFileSync(join(__dirname, '../testFiles/noisy.jdx'), 'utf8');

let analysis = fromJcamp(jcamp);

const manager = new AnalysesManager();
manager.addAnalysis(analysis);

let analyses = manager.getAnalyses();

let jsgraph = getJSGraph(analyses, {
  normalization: { filters: [{ name: 'baselineCorreciton' }] },
});

writeFileSync(join(__dirname, 'data.json'), JSON.stringify(jsgraph));
