import { scaleSequential } from 'd3-scale';
import * as chromatic from 'd3-scale-chromatic';

/**
 * @param {{
 *  color: string | string[]
 *  domain?: number[]
 *  reversed?: boolean
 * clip?: number[]
 * }} parameters
 */
export const createColorScale = ({
  color = 'Greys',
  domain = [0, 1],
  clip,
  reversed = false,
}) => {
  let scale;
  if (reversed) {
    let scheme;
    if (typeof color === 'string') scheme = chromatic[`scheme${color}`][10];
    else scheme = color;
    scale = scaleSequential(scheme.reverse());
  } else {
    scale = scaleSequential(
      typeof color === 'string' ? chromatic[`interpolate${color}`] : color,
    );
  }

  if (domain || clip) scale.domain(clip || domain);

  return scale;
};
