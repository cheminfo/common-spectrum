export function addStyle(serie, spectrum, options = {}) {
  const { color = 'darkgrey' } = options;
  serie.style = [
    {
      name: 'unselected',
      style: {
        line: {
          color,
          width: 1,
          dash: 1,
        },
      },
    },
    {
      name: 'selected',
      style: {
        line: {
          color,
          width: 3,
          dash: 1,
        },
      },
    },
  ];
  serie.name = spectrum.label || spectrum.id;
}
