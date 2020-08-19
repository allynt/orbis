import React from 'react';
import chroma from 'chroma-js';
import { ContinuousColorLegend, DiscreteColorLegend } from 'react-vis';
import 'react-vis/dist/style.css';

/**
 * @param {{
 *   scheme?: string | chroma.Color
 *   domain?: number[]
 *   type?: 'discrete' | 'decile' | 'continuous' | 'percentage'
 * }} props
 */
const ColorScale = ({ domain, scheme, type = 'continuous' }) => {
  /** @type {number[]} */
  let _domain;
  if (type === 'decile') _domain = [1, 10];
  if (type === 'percentage' && !domain) _domain = [0, 100];
  // @ts-ignore
  else _domain = domain || chroma.scale().domain();

  const colorScale = chroma.scale(scheme).domain(_domain);
  if (type === 'continuous' || type === 'percentage')
    return (
      <ContinuousColorLegend
        startTitle={_domain[0]}
        endTitle={_domain[_domain.length - 1]}
        startColor={colorScale(_domain[0]).hex()}
        endColor={colorScale(_domain[_domain.length - 1]).hex()}
      />
    );
  if (type === 'decile') {
    const items = new Array(10).fill(undefined).map((_, i) => i + 1);
    return (
      <DiscreteColorLegend
        orientation="horizontal"
        items={items}
        // @ts-ignore
        colors={colorScale.colors(items.length)}
      />
    );
  }
  return null;
};

export default ColorScale;
