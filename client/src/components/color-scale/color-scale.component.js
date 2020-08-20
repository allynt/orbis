import React from 'react';
import chroma from 'chroma-js';
import { ContinuousColorLegend, DiscreteColorLegend } from 'react-vis';
import 'react-vis/dist/style.css';
import './color-scale.css';

/**
 * @param {{
 *   className?: string
 *   domain?: number[]
 *   scheme?: string | chroma.Color
 *   type?: 'discrete' | 'decile' | 'continuous' | 'percentage'
 * }} props
 */
const ColorScale = ({ className, domain, scheme, type = 'continuous' }) => {
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
        className={className}
        startTitle={type === 'percentage' ? `${_domain[0]} %` : _domain[0]}
        endTitle={
          type === 'percentage'
            ? `${_domain[_domain.length - 1]} %`
            : _domain[_domain.length - 1]
        }
        startColor={colorScale(_domain[0]).hex()}
        endColor={colorScale(_domain[_domain.length - 1]).hex()}
      />
    );
  if (type === 'decile') {
    const items = new Array(10)
      .fill(undefined)
      .map((_, i) => ({ title: `${i + 1}`, strokeWidth: '1.5em' }));
    return (
      <DiscreteColorLegend
        className={className}
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
