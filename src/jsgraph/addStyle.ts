import type { Analysis } from '../Analysis.js';

interface StyleOptions {
  color?: string;
  opacity?: number;
  lineWidth?: number;
}
export function addStyle(
  serie: Record<string, unknown>,
  spectrum: Analysis,
  options: StyleOptions = {},
) {
  let { color = '#A9A9A9' } = options;
  const { opacity = 1, lineWidth = 1 } = options;

  if (color.match(/#[\da-f]{6}$/i)) {
    color = (color + ((opacity * 255) >> 0).toString(16)).toUpperCase();
  } else {
    color = color.replace(/rgb ?\((.*)\)/, `rgba($1,${opacity})`);
  }
  serie.style = [
    {
      name: 'unselected',
      style: {
        line: {
          color,
          width: lineWidth,
          dash: 1,
        },
      },
    },
    {
      name: 'selected',
      style: {
        line: {
          color,
          width: lineWidth + 2,
          dash: 1,
        },
      },
    },
  ];
  serie.name = spectrum.label || spectrum.id;
}
