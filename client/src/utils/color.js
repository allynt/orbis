import { scaleSequential } from 'd3-scale';
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
   * }} [parameters]
   */
  constructor({ color = 'Greys', domain = [0, 1] } = {}) {
    /** @type {import('d3-scale').ScaleSequential<string, never>} */
    this._scale = scaleSequential();
    this.color = color;
    this.domain = domain;
  }

  get domain() {
    return this._scale.domain();
  }

  set domain(newDomain) {
    this._scale.domain(newDomain);
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

  /**
   * @param  {number} value
   */
  get(value) {
    return this._scale(value);
  }
}
