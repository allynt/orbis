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
  /** @type {import('d3-scale').ScaleSequential<string, never>} */
  #scale;
  /** @type {[number, number]} */
  #domain;
  /** @type {[number, number] | false | undefined} */
  #clip;
  /** @type {ColorMap | string[]} */
  #color;
  /** @type {boolean} */
  #reversed;

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
    this.#scale = scaleSequential();
    this.color = color;
    this.domain = domain;
    this.clip = clip;
    this.reversed = reversed;
  }

  get domain() {
    return this.#scale.domain();
  }

  set domain(domain) {
    this.#domain = domain;
    this.#scale.domain(domain);
  }

  get color() {
    return this.#color;
  }

  set color(color) {
    this.#color = color;
    if (typeof color === 'string')
      this.#scale.interpolator(chromatic[`interpolate${this.#color}`]);
    else this.#scale.range(color);
  }

  get reversed() {
    return this.#reversed;
  }

  set reversed(reversed) {
    this.#reversed = reversed;
    if (this.#reversed) this.#scale.domain([this.domain[1], this.domain[0]]);
    else this.#scale.domain(this.domain);
  }

  get clip() {
    return this.#clip;
  }

  set clip(clip) {
    this.#clip = clip;
    if (!clip) {
      this.#scale.domain(this.#domain);
      return;
    }
    // @ts-ignore
    this.#scale.domain(this.#clip);
  }

  /**
   * @param  {number} value
   */
  get(value) {
    return color(this.#scale(value)).formatHex();
  }
}
