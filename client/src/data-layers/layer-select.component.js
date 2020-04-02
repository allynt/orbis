import React, { useState } from 'react';

import InfoButton from '@astrosat/astrosat-ui/dist/buttons/info-button';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';

import dialogStyles from './data-layers-dialog.module.css';
import styles from './layer-select.module.css';

const InfoBox = ({ info }) => <div className={styles.infoBox}>{info}</div>;

export const LayerSelect = ({ domain, initialSelectedLayers, onAddLayers, onRemoveLayer }) => {
  const [selectedLayers, setSelectedLayers] = useState(initialSelectedLayers ?? []);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);

  const addButtonDisabled = selectedLayers.length <= 0;

  const handleSwitchClick = layer => () => {
    // Remove if already selected, otherwise add to list of selected layers.
    const selectedLayer = selectedLayers.find(selected => selected.metadata.label === layer.metadata.label);

    if (selectedLayer) {
      setSelectedLayers(selectedLayers.filter(lyr => lyr.metadata.label !== selectedLayer.metadata.label));
      onRemoveLayer(selectedLayer);
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
    onAddLayers(selectedLayers);
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

            <div className={dialogStyles.buttons}>
              <Button
                classNames={[styles.addButton, addButtonDisabled && styles.disabled]}
                onClick={handleAddClick}
                disabled={addButtonDisabled}
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <div className={dialogStyles.noOrbSelected} data-testid="layer-select-no-domain-message">
            <p>Select Your Orb in order to find layers</p>
          </div>
        )}
      </div>
    </div>
  );
};
