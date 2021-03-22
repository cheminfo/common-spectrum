import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../fromJcamp';

function irCallback(variables: any) {
  console.log(variables);
}

describe('fromJcamp with callback', () => {
  it('absorbance', () => {
    let jcamp = readFileSync(
      join(__dirname, '../../../testFiles/ir/absorbance.jdx'),
      'utf8',
    );

    let result = fromJcamp(jcamp, { spectrumCallback: irCallback });
  });
});
