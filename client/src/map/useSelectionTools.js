import { SelectionLayer } from '@nebula.gl/layers';
import { useEffect, useState } from 'react';

export const useSelectionTools = ({ defaultIsTriggerKeyHeld = false } = {}) => {
  const [isTriggerKeyHeld, setIsTriggerKeyHeld] = useState(
    defaultIsTriggerKeyHeld,
  );

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

  const selectionLayer = new SelectionLayer({});
  return { selectionLayer: isTriggerKeyHeld && selectionLayer };
};
