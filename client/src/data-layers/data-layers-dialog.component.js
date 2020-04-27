import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import CloseButton from '@astrosat/astrosat-ui/dist/buttons/close-button';

import styles from './data-layers-dialog.module.css';
import { OrbSelect } from './orb-select.component';
import { LayerSelect } from './layer-select.component';

const DataLayersDialog = ({ domains, isVisible, close, selectedLayers, onAddLayers, onRemoveLayer }, ref) => {
  const overlayRef = useRef(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  return isVisible && ref.current
    ? ReactDOM.createPortal(
        <div
          className={styles.modal}
          onClick={event => {
            if (overlayRef.current === event.target) {
              close();
            }
          }}
          ref={overlayRef}
        >
          <div className={styles.dialog} tabIndex={-1} role="dialog" aria-label="Data Layer dialog">
            <CloseButton className={styles.closeButton} onClick={close} ariaLabel="Close" />
            <div className={styles.content}>
              <OrbSelect domains={domains} onDomainClick={setSelectedDomain} selectedDomain={selectedDomain} />
              <LayerSelect
                domain={selectedDomain}
                initialSelectedLayers={selectedLayers}
                onAddLayers={onAddLayers}
                onRemoveLayer={onRemoveLayer}
              />
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default React.memo(React.forwardRef(DataLayersDialog));
