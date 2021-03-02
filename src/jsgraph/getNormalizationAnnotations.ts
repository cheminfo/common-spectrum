/**
 * Returns a JSGraph annotation that represents the normalization
 * @param {object} [filter={}]
 * @param {object} [filter.exclusions=[]] Array of exclusions zones
 * @param {object} [boundary={y: {min:'0px', max:'2000px'}}] Height of the annotation
 */
interface AnnotationsFilter {
  exclusions?: { ignore?: boolean; from: number; to: number }[];
  from?: number;
  to?: number;
}
export function getNormalizationAnnotations(
  filter: AnnotationsFilter = {},
  boundary = { y: { min: '0px', max: '2000px' } },
) {
  let { exclusions = [] } = filter;

  let annotations = [];
  exclusions = exclusions.filter((exclusion) => !exclusion.ignore);
  annotations = exclusions.map((exclusion) => {
    let annotation = {
      type: 'rect',
      position: [
        { x: exclusion.from, y: boundary.y.min },
        { x: exclusion.to, y: boundary.y.max },
      ],
      strokeWidth: 0,
      fillColor: 'rgba(255,255,224,1)',
    };
    return annotation;
  });
  if (filter.from !== undefined) {
    annotations.push({
      type: 'rect',
      position: [
        { x: Number.MIN_SAFE_INTEGER, y: boundary.y.min },
        { x: filter.from, y: boundary.y.max },
      ],
      strokeWidth: 0,
      fillColor: 'rgba(255,255,224,1)',
    });
  }
  if (filter.to !== undefined) {
    annotations.push({
      type: 'rect',
      position: [
        { x: filter.to, y: boundary.y.min },
        { x: Number.MAX_SAFE_INTEGER, y: boundary.y.max },
      ],
      strokeWidth: 0,
      fillColor: 'rgba(255,255,224,1)',
    });
  }
  return annotations;
}
