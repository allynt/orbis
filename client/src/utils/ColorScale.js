import { color } from 'd3-color';
import { scaleOrdinal, scaleSequential } from 'd3-scale';
import * as chromatic from 'd3-scale-chromatic';

/** @typedef {'hex' | 'rgb' | 'array'} ColorFormat */
/**
 * @typedef {{
 *   color: string | number[]
 *   stop: number
 * }} ColorStop
 */

/**
 * @typedef { import('d3-scale').ScaleSequential<string, never>
 * | import('d3-scale').ScaleOrdinal} ScaleType
 */

export class ColorScale {
  /** @type {ScaleType} */
  #scale;
  /** @type {[number, number] | string[]} */
  #domain;
  /** @type {[number, number] | false | undefined} */
  #clip;
  /** @type {import('typings').ColorMap | string[]} */
  #color;
  /** @type {boolean} */
  #reversed;
  /** @type {ColorFormat} */
  #format;
  /** @type {number} */
  #classes;

  /**
   * @param {{
   *   color?: import('typings').ColorMap | string[]
   *   domain?: [number, number] | string[]
   *   reversed?: boolean
   *   clip?: [number, number]
   *   format?: ColorFormat
   *   classes?: number
   * }} [parameters]
   */
  constructor({
    color = 'Greys',
    domain = [0, 1],
    reversed = false,
    clip,
    format = 'hex',
    classes = 9,
  } = {}) {
    this.#scale = this.isDiscrete(domain) ? scaleOrdinal() : scaleSequential();
    this.#classes = classes;
    this.domain = domain;
    this.color = color;
    this.clip = clip;
    this.reversed = reversed;
    this.format = format;
  }

  isDiscrete(domain = this.#domain) {
    return typeof domain[0] === 'string';
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
      if (this.isDiscrete()) {
        const schemeKey = Object.keys(chromatic).find(
          key => key.toLowerCase() === `scheme${this.#color}`.toLowerCase(),
        );

        /** @type {string[] | string[][]} */
        const scheme = chromatic[schemeKey];

        if (
          scheme.some(
            /** @param {string | string[]} s */
            s => typeof s === 'string',
          )
        ) {
          this.#scale.range(scheme);
        } else {
          if (!scheme[this.#classes]) {
            console.warn(
              `${this.#color} colormap does not have ${this.#classes} classes`,
            );
            const maxClasses = [...scheme.reverse()].find(s => !!s);
            this.#scale.range(maxClasses);
          } else this.#scale.range(scheme[this.#classes]);
        }
      } else {
        const interpolatorKey = Object.keys(chromatic).find(
          key =>
            key.toLowerCase() === `interpolate${this.#color}`.toLowerCase(),
        );
        this.#scale.interpolator(chromatic[interpolatorKey]);
      }
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
   * @param {number} [count]
   * @returns {number[]}
   */
  ticks(count) {
    // @ts-ignore
    return !this.isDiscrete() ? this.#scale.ticks(count) : null;
  }

  /**
   * @param  {number | string} value
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
