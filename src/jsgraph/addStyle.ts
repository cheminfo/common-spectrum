import { Analysis } from '../Analysis';

interface StyleOptions {
  color?: string;
  opacity?: number;
  lineWidth?: number;
}
export function addStyle(
  serie: Record<string, unknown>,
  measurement: Analysis,
  options: StyleOptions = {},
) {
  let { color = '#A9A9A9', opacity = 1, lineWidth = 1 } = options;
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  if (color.match(/#[0-9A-F]{6}$/i)) {
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
  serie.name = measurement.label || measurement.id;
}
