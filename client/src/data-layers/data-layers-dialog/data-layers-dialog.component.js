import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { CloseButton } from '@astrosat/astrosat-ui';

import { OrbSelect } from './orb-select/orb-select.component';
import { LayerSelect } from './layer-select/layer-select.component';

import styles from './data-layers-dialog.module.css';

/** @typedef {{
 *     name: string
 *     description: string
 *     sources: import('./layer-select/layer-select.component').OrbSources}[]
 * } Orbs */

/**
 * @param {{
 *   orbs: Orbs
 *   isVisible: boolean
 *   selectedSources?: Source['source_id'][]
 *   close: () => void
 *   onSubmit: (sources: Source['source_id'][]) => void
 * }} props
 * @param {*} ref
 */
const DataLayersDialog = (
  { orbs, isVisible, selectedSources, close, onSubmit },
  ref,
) => {
  const overlayRef = useRef(null);
  /** @type {[string, React.Dispatch<string>]} */
  const [selectedOrbName, setSelectedOrbName] = useState();

  return isVisible && ref.current
    ? ReactDOM.createPortal(
        <div
          ref={overlayRef}
          className={styles.modal}
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
            <div className={styles.content}>
              <OrbSelect
                orbs={orbs}
                onOrbClick={setSelectedOrbName}
                selectedOrbName={selectedOrbName}
              />
              <LayerSelect
                orbSources={
                  orbs.find(orb => orb.name === selectedOrbName)?.sources
                }
                selectedSources={selectedSources}
              />
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default React.memo(React.forwardRef(DataLayersDialog));
