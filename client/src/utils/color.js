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
