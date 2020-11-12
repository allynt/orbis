import React, { useEffect, useRef, useState } from 'react';

import { isEqual } from 'lodash';

import { CloseButton } from '@astrosat/astrosat-ui';

import { OrbSelect } from './orb-select/orb-select.component';
import { LayerSelect } from './layer-select/layer-select.component';

import styles from './data-layers-dialog.module.css';

/**
 * @param {{
 *   orbs: OrbWithCategorisedSources[]
 *   initialSelectedSources?: Source['source_id'][]
 *   close: () => void
 *   onSubmit: (sources: Source['source_id'][]) => void
 * }} props
 */
const DataLayersDialog = ({
  orbs,
  initialSelectedSources = [],
  close,
  onSubmit,
}) => {
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

  /** @param {{source_ids: Source['source_id'][], selected: boolean}} params */
  const handleSourcesChange = ({ source_ids, selected }) => {
    if (selected) setSelectedSources(current => [...current, ...source_ids]);
    else {
      setSelectedSources(current =>
        current.filter(v => !source_ids.includes(v)),
      );
    }
  };

  const handleSubmit = () => onSubmit && onSubmit(selectedSources);

  return (
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
          orbSources={orbs?.find(orb => orb.name === selectedOrbName)?.sources}
          selectedSources={selectedSources}
          onSourcesChange={handleSourcesChange}
          onSubmit={handleSubmit}
          hasMadeChanges={hasMadeChanges}
        />
      </div>
    </div>
  );
};

export default DataLayersDialog;
