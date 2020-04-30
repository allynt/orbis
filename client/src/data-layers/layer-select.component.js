import React, { useState } from 'react';

import InfoButton from '@astrosat/astrosat-ui/dist/buttons/info-button';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';

import dialogStyles from './data-layers-dialog.module.css';
import styles from './layer-select.module.css';

const InfoBox = ({ info }) => <div className={styles.infoBox}>{info}</div>;

export const LayerSelect = ({ domain, initialSelectedLayers, onAddLayers, onRemoveLayer, close }) => {
  const [selectedLayers, setSelectedLayers] = useState(initialSelectedLayers ?? []);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);

  const handleSwitchClick = layer => () => {
    // "Accept and Close" button is disabled initially, but is enabled as soon as the user clicks something, and stays enabled for dialog lifetime
    if (!hasMadeChanges) setHasMadeChanges(true);

    // Remove if already selected, otherwise add to list of selected layers.
    const selectedLayer = selectedLayers.find(selected => selected.metadata.label === layer.metadata.label);

    if (selectedLayer) {
      setSelectedLayers(selectedLayers.filter(lyr => lyr.metadata.label !== selectedLayer.metadata.label));
    } else {
      setSelectedLayers([...selectedLayers, layer]);
    }
  };

  const handleInfoClick = layer => () => {
    if (layer === info) {
      setIsInfoVisible(old => !old);
    } else {
      setInfo(layer);
      setIsInfoVisible(true);
    }
  };

  const handleAddClick = () => {
    //Check Redux layers, if there are layers in Redux state that are not in selectedLayers, they have been de-selected. Remove them all.
    for (const layer of initialSelectedLayers) {
      if (!selectedLayers.includes(layer)) {
        onRemoveLayer(layer);
      }
    }

    //Proceed to add selectedLayers if there are any
    selectedLayers.length > 0 && onAddLayers(selectedLayers);
    close();
  };

  return (
    <div className={styles.subcategories}>
      <div className={dialogStyles.header}>
        <h3>Select Your Layers</h3>
      </div>
      <div className={styles.layerList}>
        {domain ? (
          <div className={styles.switchContainer}>
            <ul>
              {domain &&
                domain.layers.map(layer => {
                  const isSelected = !!selectedLayers.find(selected => layer.name === selected.name);
                  return (
                    <li key={layer.metadata.label} className={styles.row} data-testid={`layer-list-item-${layer.name}`}>
                      <Switch
                        name={layer.name}
                        value={layer.name}
                        label={layer.metadata.label}
                        onClick={handleSwitchClick(layer)}
                        ariaLabel={layer.metadata.label}
                        checked={isSelected}
                      />
                      {isInfoVisible && info.name === layer.name && <InfoBox info={layer.metadata.description} />}
                      <InfoButton classNames={[styles.info]} onClick={handleInfoClick(layer)} />
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          <div className={dialogStyles.noOrbSelected} data-testid="layer-select-no-domain-message">
            <p>Select Your Orb in order to find layers</p>
          </div>
        )}
      </div>
      <div className={dialogStyles.buttons}>
        <Button
          classNames={[styles.addButton, !hasMadeChanges && styles.disabled]}
          onClick={handleAddClick}
          disabled={!hasMadeChanges}
        >
          Accept and Close
        </Button>
      </div>
    </div>
  );
};
