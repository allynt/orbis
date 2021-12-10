import { useState } from 'react';

import { SelectionLayer } from '@nebula.gl/layers';
import { filter, groupBy, uniqBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { activeLayersSelector } from 'data-layers/data-layers.slice';
import { useDocumentEventListener } from 'hooks/useDocumentEventListener';
import { createReduxSafePickedInfo } from 'utils/data';
import { KEY_CODES } from 'utils/KEY_CODES';

import { setClickedFeatures } from './orbs/layers.slice';

/**
 * @param {import('typings').PickedMapFeature[]} pickingInfos
 */
export const filterAndSortPickedInfo = pickingInfos => {
  const uniqueInfos = uniqBy(pickingInfos, 'object.properties.index');
  const filteredInfos = filter(
    uniqueInfos,
    info =>
      info.object.geometry.type != null &&
      (info.object.geometry.type === 'Polygon' ||
        info.object.geometry.type === 'MultiPolygon'),
  );
  return groupBy(filteredInfos, 'layer.id');
};

/** @param {KeyboardEvent} event */
const hasTriggerKey = event =>
  event.key === KEY_CODES.CONTROL ||
  (navigator.appVersion.includes('Mac') && event.metaKey);

export const useSelectionTools = ({ defaultIsTriggerKeyHeld = false } = {}) => {
  const dispatch = useDispatch();
  const [isTriggerKeyHeld, setIsTriggerKeyHeld] = useState(
    defaultIsTriggerKeyHeld,
  );
  const layerIds = useSelector(activeLayersSelector);

  /** @param {KeyboardEvent} event */
  const handleKeyDown = event => {
    if (hasTriggerKey(event)) setIsTriggerKeyHeld(true);
  };

  /** @param {KeyboardEvent} event */
  const handleKeyUp = event => {
    if (event.key === KEY_CODES.CONTROL || navigator.appVersion.includes('Mac'))
      setIsTriggerKeyHeld(false);
  };

  useDocumentEventListener('keydown', handleKeyDown);
  useDocumentEventListener('keyup', handleKeyUp);

  const selectionLayer = new SelectionLayer({
    id: 'selection-layer',
    layerIds,
    onSelect: ({ pickingInfos }) => {
      const sortedAndFilteredInfo = filterAndSortPickedInfo(pickingInfos);
      for (const [key, value] of Object.entries(sortedAndFilteredInfo))
        dispatch(
          setClickedFeatures({
            key,
            clickedFeatures: value.map(createReduxSafePickedInfo),
          }),
        );
    },
  });
  // return { selectionLayer };
  return { selectionLayer: isTriggerKeyHeld && selectionLayer };
};
