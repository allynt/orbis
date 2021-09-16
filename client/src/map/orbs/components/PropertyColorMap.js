import React from 'react';

import { find, get } from 'lodash';
import { useSelector } from 'react-redux';

import { ColormapRangeSlider } from 'components';

import { otherSelector } from '../layers.slice';

/**
 * @type {import('typings').SidebarComponent<{
 *  stateKey?: string
 *  propertyStateKey?: string
 * }>}
 */
export default ({
  selectedLayer,
  stateKey = selectedLayer.source_id,
  propertyStateKey = 'property',
}) => {
  const otherState = useSelector(state => otherSelector(stateKey)(state?.orbs));
  const propertyName = get(otherState, propertyStateKey);
  /** @type {import('typings').ContinuousProperty} */
  // @ts-ignore
  const property =
    find(selectedLayer.metadata.properties, { name: propertyName }) ??
    selectedLayer.metadata.properties[0];
  const { min, max, clip_min, clip_max } = property;
  const { color, colormap_reversed } = property.application.orbis.display;

  return (
    <ColormapRangeSlider
      barOnly
      colorMap={color}
      reversed={colormap_reversed}
      min={min}
      max={max}
      clipMin={clip_min}
      clipMax={clip_max}
    />
  );
};
