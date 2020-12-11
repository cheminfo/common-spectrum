declare module 'common-spectrum' {
  type json = Record<string, unknown>;
  interface VariableType {
    data: number[];
    label: string;
  }
  interface SpectrumType {
    variables: { x: VariableType; y: VariableType };
    title?: string;
    dataType?: string;
    meta?: Record<string, unknown>;
  }

  interface MultipleType {
    series: Array<{
      x: number[];
      y: number[];
      label: string;
    }>;
    axis: {
      x: { label: string };
      y: { label: string };
    };
  }

  export class Analysis {
    public pushSpectrum(data: json, meta: json): void;
    public getXYSpectrum(query: json): SpectrumType;
    public spectra: SpectrumType[];
  }
  export function fromJcamp(text: string): Analysis;
  export function toJcamp(analysis: Analysis): string;
  export function getMultiple(
    analyses: Analysis[],
    selector: json,
  ): MultipleType;
  export type AnalysesManager = unknown;
  export type getJSGraph = unknown;
  export type getNormalizationAnnotations = unknown;
}
