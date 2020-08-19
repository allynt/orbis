import React from 'react';
import chroma from 'chroma-js';
import { ContinuousColorLegend } from 'react-vis';
import 'react-vis/dist/style.css';

/**
 * @param {{
 *   scheme?: string | chroma.Color
 *   domain?: number[]
 * }} props
 */
const ColorScale = ({ domain, scheme }) => {
  /** @type {number[]} */ // @ts-ignore
  const _domain = domain || chroma.scale().domain();
  const colorScale = chroma.scale(scheme).domain(_domain);
  return (
    <ContinuousColorLegend
      startTitle={_domain[0]}
      endTitle={_domain[1]}
      startColor={colorScale(_domain[0]).hex()}
      endColor={colorScale(_domain[1]).hex()}
    />
  );
};

export default ColorScale;
