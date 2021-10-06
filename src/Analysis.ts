import type { MeasurementXYVariables, MeasurementXY } from 'cheminfo-types';
import isAnyArray from 'is-any-array';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import { MeasurementNormalizationOptions } from './types/MeasurementNormalizationOptions';
import { MeasurementSelector } from './types/MeasurementSelector';
import { getMeasurementXY } from './util/getMeasurementXY';
import { getNormalizedMeasurement } from './util/getNormalizedMeasurement';

type MeasurementCallback = (
  variables: MeasurementXYVariables,
) => MeasurementXYVariables;

interface AnalysisOptions {
  id?: string;
  label?: string;
  measurementCallback?: MeasurementCallback;
}
interface NormalizedOptions {
  normalization?: MeasurementNormalizationOptions;
  selector?: MeasurementSelector;
}

/**
 * Class allowing to store and manipulate an analysis.
 * An analysis may contain one or more measurements that can be selected
 * based on their units
 */
export class Analysis {
  public id: string;
  public label: string;
  public measurementCallback: MeasurementCallback | undefined;
  public measurements: Array<MeasurementXY>;
  public cache: Record<string, MeasurementXY | undefined>;

  public constructor(options: AnalysisOptions = {}) {
    this.id = options.id || Math.random().toString(36).substring(2, 10);
    this.label = options.label || this.id;
    this.measurementCallback = options.measurementCallback;
    this.measurements = [];
    this.cache = {};
  }

  /**
   * Add a measurement in the internal measurements variable
   */
  public pushMeasurement(
    variables: MeasurementXYVariables,
    options: Omit<MeasurementXY, 'variables'> = {},
  ) {
    this.measurements.push(
      standardizeData(variables, options, {
        measurementCallback: this.measurementCallback,
      }),
    );
    this.cache = {};
  }

  /**
   * Retrieve a MeasurementXY based on x/y units
   */
  public getMeasurementXY(selector: MeasurementSelector = {}) {
    let id = JSON.stringify(selector);
    if (!this.cache[id]) {
      this.cache[id] = getMeasurementXY(this.measurements, selector);
    }
    return this.cache[id];
  }

  /**
   * Retrieve a xy object
   * @param selector.units Units separated by vs like for example "g vs °C"
   * @param selector.xUnits if undefined takes the first variable
   * @param selector.yUnits if undefined takes the second variable
   */
  public getXY(selector: MeasurementSelector = {}) {
    let measurement = this.getMeasurementXY(selector);
    if (!measurement) return undefined;
    return {
      x: measurement.variables.x.data,
      y: measurement.variables.y.data,
    };
  }

  /**
   * Return the data object for specific x/y units with possibly some
   * normalization options
   * @param options.selector.xUnits // if undefined takes the first variable
   * @param options.selector.yUnits // if undefined takes the second variable
   */
  public getNormalizedMeasurement(options: NormalizedOptions = {}) {
    const { normalization, selector } = options;
    const measurement = this.getMeasurementXY(selector);
    if (!measurement) return undefined;
    return getNormalizedMeasurement(measurement, normalization);
  }

  /**
   * Returns the first measurement. This method could be improved in the future
   * @returns
   */
  public getFirstMeasurement() {
    return this.measurements[0];
  }

  /**
   * Returns the xLabel
   * @param selector.xUnits // if undefined takes the first variable
   * @param selector.yUnits // if undefined takes the second variable
   */
  public getXLabel(selector: MeasurementSelector) {
    return this.getMeasurementXY(selector)?.variables.x.label;
  }

  /**
   * Returns the yLabel
   * @param selector.xUnits // if undefined takes the first variable
   * @param selector.yUnits // if undefined takes the second variable
   */
  public getYLabel(selector: MeasurementSelector) {
    return this.getMeasurementXY(selector)?.variables.y.label;
  }
}

/**
 * Internal function that ensure the order of x / y array
 */
function standardizeData(
  variables: MeasurementXYVariables,
  options: Omit<MeasurementXY, 'variables'>,
  analysisOptions: Pick<AnalysisOptions, 'measurementCallback'>,
) {
  let { meta = {}, dataType = '', description = '' } = options;
  const { measurementCallback } = analysisOptions;

  if (measurementCallback) {
    measurementCallback(variables);
  }
  let xVariable = variables.x;
  let yVariable = variables.y;
  if (!xVariable || !yVariable) {
    throw Error('A measurement must contain at least x and y variables');
  }
  if (!isAnyArray(xVariable.data) || !isAnyArray(yVariable.data)) {
    throw Error('x and y variables must contain an array data');
  }

  let x = xVariable.data;
  let reverse = x && x.length > 1 && x[0] > x[x.length - 1];

  for (let [key, variable] of Object.entries(variables)) {
    if (reverse) variable.data = variable.data.reverse();
    variable.label = variable.label || key;
    if (variable.label.match(/^.*[([](?<units>.*)[)\]].*$/)) {
      const units = variable.label.replace(
        /^.*[([](?<units>.*)[)\]].*$/,
        '$<units>',
      );
      if (!variable.units || variable.units === units) {
        variable.units = units;
        variable.label = variable.label.replace(/[([].*[)\]]/, '').trim();
      }
    }
    variable.min = min(variable.data);
    variable.max = max(variable.data);
    variable.isMonotone = xIsMonotone(variable.data);
  }

  return {
    variables,
    description,
    dataType,
    meta,
  };
}
