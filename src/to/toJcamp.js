import { fromJSON } from 'convert-to-jcamp';

export function toJcamp(spectrum, options = {}) {
  const { dataType = '' } = options;
  let jcamps = [];
  for (let flavorName in spectrum.flavors) {
    let data = spectrum.get(flavorName);
    jcamps.push(
      getJcamp(data, {
        dataType,
        flavorName,
      }),
    );
  }

  return jcamps.join('\n');
}

function getJcamp(flavor, options) {
  let jcampOptions = {
    xUnit: flavor.xLabel,
    yUnit: flavor.yLabel,
    title: flavor.title,
    type: options.dataType,
    info: { ...flavor.meta, cheminfoFlavor: options.flavorName },
  };
  return fromJSON({ x: flavor.x, y: flavor.y }, jcampOptions);
}
