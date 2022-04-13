export interface PlotObject {
  series: Array<{
    type: 'line';
    displayMarker: boolean;
    label: string;
    data: Array<{ x: number; y: number }>;
  }>;
  axes: Array<{ position: 'bottom' | 'left'; label: string }>;
  dimensions: { width: number; heigth: number };
  meta: Record<string, string>;
}
