import { color as d3Color } from 'd3-color';
import { toPairs } from 'lodash';

import { ColorScale } from './ColorScale';
import { isRealValue } from './isRealValue';

/** @type {[number, number, number, number]} */
export const COLOR_PRIMARY_ARRAY = [246, 190, 0, 255];

/**
 * @param {import("typings/orbis").Property} property
 * @param {import('./ColorScale').ColorFormat} format
 */
export const getColorScaleForProperty = (property, format) => {
  switch (property.type) {
    case 'decile':
    case 'percentage':
    case 'continuous':
      const {
        min,
        max,
        clip_min,
        clip_max,
        application: {
          orbis: {
            display: { color, colormap_reversed },
          },
        },
      } = /** @type {import('typings').ContinuousProperty} */ (property);

      return new ColorScale({
        color: color,
        domain: [min, max],
        reversed: colormap_reversed,
        clip: (isRealValue(clip_min) || isRealValue(clip_max)) && [
          clip_min ?? min,
          clip_max ?? max,
        ],
        format,
      });
    case 'discrete':
      const { categories } = /** @type {import('typings').DiscreteProperty} */ (
        property
      );
      const pairs = toPairs(categories).map(([category, obj]) => [
        category,
        obj.color,
      ]);

      return new ColorScale({
        domain: pairs.map(p => p[0]),
        color: pairs.map(p => p[1]),
        format,
      });
    default:
      return new ColorScale({ format });
  }
};

/**
 * @param {string} hexString
 */
export const hexToRgbArray = hexString => {
  if (hexString == null) return;
  const { r, g, b } = d3Color(
    `${hexString[0] !== '#' ? '#' : ''}${hexString}`,
  ).rgb();
  return [r, g, b];
};
