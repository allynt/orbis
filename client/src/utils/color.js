import { scaleSequential } from 'd3-scale';
import { color } from 'd3-color';
import * as chromatic from 'd3-scale-chromatic';

/**
 * @param {{
 *  clip?: number[]
 *  color?: string | string[]
 *  domain?: number[]
 *  reversed?: boolean
 * }} parameters
 */
export const createColorScale = ({
  clip,
  color = 'Greys',
  domain = [0, 1],
  reversed = false,
}) => {
  const scale = scaleSequential(
    typeof color === 'string' ? chromatic[`interpolate${color}`] : color,
  );

  if (clip || domain) {
    const _domain = clip ?? domain;
    scale.domain(reversed ? [_domain[1], _domain[0]] : _domain);
  }

  return scale;
};

export class ColorScale {
  /**
   * @param {{
   *   color?: ColorMap | string[]
   *   domain?: [number, number]
   *   reversed?: boolean
   *   clip?: [number, number]
   * }} [parameters]
   */
  constructor({
    color = 'Greys',
    domain = [0, 1],
    reversed = false,
    clip,
  } = {}) {
    /** @type {import('d3-scale').ScaleSequential<string, never>} */
    this._scale = scaleSequential();
    this.color = color;
    this.domain = domain;
    this.clip = clip;
    this.reversed = reversed;
  }

  get domain() {
    return this._scale.domain();
  }

  set domain(domain) {
    this._domain = domain;
    this._scale.domain(domain);
  }

  /**
   * @type {ColorMap | string[]}
   */
  get color() {
    return this._color;
  }

  set color(color) {
    this._color = color;
    if (typeof color === 'string')
      this._scale.interpolator(chromatic[`interpolate${this._color}`]);
    else this._scale.range(color);
  }

  get reversed() {
    return this._reversed;
  }

  set reversed(reversed) {
    this._reversed = reversed;
    if (this._reversed) this._scale.domain([this.domain[1], this.domain[0]]);
    else this._scale.domain(this.domain);
  }

  /**
   * @type {[number, number] | false | undefined}
   */
  get clip() {
    return this._clip;
  }

  set clip(clip) {
    this._clip = clip;
    if (!clip) {
      this._scale.domain(this._domain);
      return;
    }
    // @ts-ignore
    this._scale.domain(this._clip);
  }

  /**
   * @param  {number} value
   */
  get(value) {
    return color(this._scale(value)).formatHex();
  }
}
