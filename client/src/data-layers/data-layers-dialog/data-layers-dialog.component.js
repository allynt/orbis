import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { isEqual } from 'lodash';

import { CloseButton } from '@astrosat/astrosat-ui';

import { OrbSelect } from './orb-select/orb-select.component';
import { LayerSelect } from './layer-select/layer-select.component';

import styles from './data-layers-dialog.module.css';

/** @typedef {{
 *     name: string
 *     description: string
 *     sources: import('./layer-select/layer-select.component').OrbSources}
 * } Orb */

/**
 * @param {{
 *   orbs: Orb[]
 *   isVisible: boolean
 *   initialSelectedSources?: Source['source_id'][]
 *   close: () => void
 *   onSubmit: (sources: Source['source_id'][]) => void
 * }} props
 * @param {*} ref
 */
const DataLayersDialog = (
  { orbs, isVisible, initialSelectedSources = [], close, onSubmit },
  ref,
) => {
  const overlayRef = useRef(null);
  /** @type {[string, React.Dispatch<string>]} */
  const [selectedOrbName, setSelectedOrbName] = useState();
  const [selectedSources, setSelectedSources] = useState(
    initialSelectedSources,
  );
  const [hasMadeChanges, setHasMadeChanges] = useState(false);

  useEffect(() => {
    setHasMadeChanges(!isEqual(initialSelectedSources, selectedSources));
  }, [initialSelectedSources, selectedSources]);

  /** @param {{source_id: Source['source_id'], selected: boolean}} params */
  const handleSourceChange = ({ source_id, selected }) => {
    selected
      ? setSelectedSources(current => [...current, source_id])
      : setSelectedSources(current => current.filter(id => id !== source_id));
  };

  const handleSubmit = () => onSubmit && onSubmit(selectedSources);

  return isVisible && ref.current
    ? ReactDOM.createPortal(
        <div
          ref={overlayRef}
          className={styles.overlay}
          onClick={event => {
            if (overlayRef.current === event.target) {
              close();
            }
          }}
          data-testid="overlay"
        >
          <div
            className={styles.dialog}
            tabIndex={-1}
            role="dialog"
            aria-label="Data Layers dialog"
          >
            <CloseButton className={styles.closeButton} onClick={close} />
            <OrbSelect
              orbs={orbs}
              onOrbClick={setSelectedOrbName}
              selectedOrbName={selectedOrbName}
            />
            <LayerSelect
              orbSources={
                orbs?.find(orb => orb.name === selectedOrbName)?.sources
              }
              selectedSources={selectedSources}
              onSourceChange={handleSourceChange}
              onSubmit={handleSubmit}
              hasMadeChanges={hasMadeChanges}
            />
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default React.forwardRef(DataLayersDialog);
