import { toJcamps } from './toJcamps';

export function toJcamp(analysis, options = {}) {
  return toJcamps(analysis, options).join('\n');
}
