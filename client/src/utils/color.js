import chroma from 'chroma-js';

/**
 * @param {{
 *  color: string | string[] | import('chroma-js').Color[]
 *  domain?: number[]
 *  reversed?: boolean
 * }} parameters
 */
export const createColorScale = ({ color, domain, reversed = false }) => {
  const scale = chroma.scale(
    // @ts-ignore
    reversed ? chroma.scale(color).colors().reverse() : color,
  );
  if (domain) scale.domain(domain);
  return scale;
};
