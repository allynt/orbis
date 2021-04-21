import { SelectionLayer } from '@nebula.gl/layers';
import { activeLayersSelector } from 'data-layers/data-layers.slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useSelectionTools = ({ defaultIsTriggerKeyHeld = false } = {}) => {
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
      console.log(pickingInfos);
    },
  });
  return { selectionLayer: isTriggerKeyHeld && selectionLayer };
};
