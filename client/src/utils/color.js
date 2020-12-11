import { scaleSequential } from 'd3-scale';
import { color } from 'd3-color';
import * as chromatic from 'd3-scale-chromatic';

/** @typedef {'hex' | 'rgb' | 'array'} ColorFormat */
/**
 * @typedef {{
 *   color: string | number[]
 *   stop: number
 * }} ColorStop
 */

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
  /** @type {ColorFormat} */
  #format;

  /**
   * @param {{
   *   color?: ColorMap | string[]
   *   domain?: [number, number]
   *   reversed?: boolean
   *   clip?: [number, number]
   *   format?: ColorFormat
   * }} [parameters]
   */
  constructor({
    color = 'Greys',
    domain = [0, 1],
    reversed = false,
    clip,
    format = 'hex',
  } = {}) {
    this.#scale = scaleSequential();
    this.color = color;
    this.domain = domain;
    this.clip = clip;
    this.reversed = reversed;
    this.format = format;
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
    if (typeof color === 'string') {
      const interpolatorKey = Object.keys(chromatic).find(
        key => key.toLowerCase() === `interpolate${this.#color}`.toLowerCase(),
      );
      this.#scale.interpolator(chromatic[interpolatorKey]);
    } else this.#scale.range(color);
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

  get format() {
    return this.#format;
  }

  set format(format) {
    this.#format = format;
  }

  /**
   * @param  {number} value
   * @param {ColorFormat} [format]
   */
  get(value, format = this.#format) {
    const colorValue = color(this.#scale(value));
    switch (format) {
      case 'array':
        const { r, g, b } = colorValue.rgb();
        return [r, g, b];
      case 'rgb':
        return colorValue.formatRgb();
      case 'hex':
      default:
        return colorValue.formatHex();
    }
  }

  /**
   * @param {ColorFormat} [format]
   * @returns {ColorStop[]}
   */
  getGradient(format) {
    const samples = 100 + 1;
    const [min, max] = this.#domain;
    return new Array(samples).fill(undefined).map((_, i) => {
      const stopValue = (i / 100) * (max - min) + min;
      const color = this.get(stopValue, format);
      return { color, stop: i };
    });
  }
}
