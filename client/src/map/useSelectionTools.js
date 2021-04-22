import { SelectionLayer } from '@nebula.gl/layers';
import { activeLayersSelector } from 'data-layers/data-layers.slice';
import { filter, groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReduxSafePickedInfo } from 'utils/data';
import { setClickedFeatures } from './orbs/layers.slice';

/**
 * @param {import('typings/orbis').PickedMapFeature[]} pickingInfos
 */
export const filterAndSortPickedInfo = pickingInfos => {
  const filteredInfos = filter(
    pickingInfos,
    info =>
      info.object.geometry.type != null &&
      (info.object.geometry.type === 'Polygon' ||
        info.object.geometry.type === 'MultiPolygon'),
  );
  return groupBy(filteredInfos, 'layer.id');
};

export const useSelectionTools = ({ defaultIsTriggerKeyHeld = false } = {}) => {
  const dispatch = useDispatch();
  const [isTriggerKeyHeld, setIsTriggerKeyHeld] = useState(
    defaultIsTriggerKeyHeld,
  );
  const layerIds = useSelector(activeLayersSelector);

  /** @param {KeyboardEvent} event */
  const handleKeyDown = event => {
    if (
      event.key === 'Control' ||
      (navigator.appVersion.includes('Mac') && event.metaKey)
    )
      setIsTriggerKeyHeld(true);
  };

  /** @param {KeyboardEvent} event */
  const handleKeyUp = event => {
    if (
      event.key === 'Control' ||
      (navigator.appVersion.includes('Mac') && event.metaKey)
    )
      setIsTriggerKeyHeld(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
  return { selectionLayer: isTriggerKeyHeld && selectionLayer };
};
