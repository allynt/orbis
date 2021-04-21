import { SelectionLayer } from '@nebula.gl/layers';
import { activeLayersSelector } from 'data-layers/data-layers.slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setClickedFeatures } from './orbs/layers.slice';

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
      dispatch(
        setClickedFeatures({
          key: pickingInfos[0].layer.id,
          clickedFeatures: pickingInfos,
        }),
      );
    },
  });
  return { selectionLayer: isTriggerKeyHeld && selectionLayer };
};
