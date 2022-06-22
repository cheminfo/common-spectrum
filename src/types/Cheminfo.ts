/**
 * In order to store an array of numbers we prefer to either use native javascript
 * arrays or to use Float64Array
 */

export type DoubleArray = number[] | Float64Array;

export interface Spectrum<DataType extends DoubleArray = DoubleArray> {
  variables: SpectrumVariables<DataType>;
  title?: string;
  dataType?: string;
  setup?: Record<string, any>;
  id?: string;
  meta?: Record<string, any>;
}

/**
 * Describe a variable that can only contains as data an array of number
 */
export interface SpectrumVariable<DataType extends DoubleArray = DoubleArray> {
  /**
   * Unit of the data in the column
   * @TJS-examples ["Pa", "kg"]
   */
  units?: string;
  /**
   * Long name of the column
   *@TJS-examples ["absolute pressure"]
   */
  label: string;
  /**
   *
   */
  isDependent?: boolean;
  /**
   * An array containing numerical data
   */
  data: DataType;
  /** One letter that allows to define the variable */
  symbol?: OneLetter;
  /** If defined contain the minimal value of the data */
  min?: number;
  /** If defined contain the maximal value of the data */
  max?: number;
  /** If defined indicates (true or false) if the data series is monotone  */
  isMonotone?: boolean;
}

export interface SpectrumVariables<DataType extends DoubleArray = DoubleArray> {
  a?: SpectrumVariable<DataType>;
  b?: SpectrumVariable<DataType>;
  c?: SpectrumVariable<DataType>;
  d?: SpectrumVariable<DataType>;
  e?: SpectrumVariable<DataType>;
  f?: SpectrumVariable<DataType>;
  g?: SpectrumVariable<DataType>;
  h?: SpectrumVariable<DataType>;
  i?: SpectrumVariable<DataType>;
  j?: SpectrumVariable<DataType>;
  k?: SpectrumVariable<DataType>;
  l?: SpectrumVariable<DataType>;
  m?: SpectrumVariable<DataType>;
  n?: SpectrumVariable<DataType>;
  o?: SpectrumVariable<DataType>;
  p?: SpectrumVariable<DataType>;
  q?: SpectrumVariable<DataType>;
  r?: SpectrumVariable<DataType>;
  s?: SpectrumVariable<DataType>;
  t?: SpectrumVariable<DataType>;
  u?: SpectrumVariable<DataType>;
  v?: SpectrumVariable<DataType>;
  w?: SpectrumVariable<DataType>;
  x: SpectrumVariable<DataType>;
  y: SpectrumVariable<DataType>;
  z?: SpectrumVariable<DataType>;
}

/**
 * A type that allows one uppercase or lowercase letter
 */
export type OneLowerCase =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

/**
 * A type that allows one uppercase or lowercase letter
 */
export type OneLetter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
