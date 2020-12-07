import chroma from 'chroma-js';

/**
 * @param {{
 *  color: string | string[] | import('chroma-js').Color[]
 *  domain?: number[]
 *  reverse?: boolean
 * }} parameters
 */
export const createColorScale = ({ color, domain, reverse = false }) => {
  const scale = chroma.scale(
    // @ts-ignore
    reverse ? chroma.scale(color).colors().reverse() : color,
  );
  if (domain) scale.domain(domain);
  return scale;
};
