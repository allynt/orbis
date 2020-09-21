import React, { useState, useCallback, useEffect } from 'react';

import { InfoButton, Button, Switch } from '@astrosat/astrosat-ui';

import InfoBox from 'components/info-box/info-box.component';
import dialogStyles from '../data-layers-dialog.module.css';
import styles from './layer-select.module.css';

export const LayerSelect = ({
  domain,
  initialSelectedLayers,
  onAddLayers,
  onRemoveLayer,
  close,
}) => {
  const [selectedLayers, setSelectedLayers] = useState(
    initialSelectedLayers ?? [],
  );
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);

  const handleClick = useCallback(
    event => {
      if (isInfoVisible && event.path) {
        for (let element of event.path) {
          if (element.classList)
            if (
              Object.values(element.classList).includes(styles.info) ||
              Object.values(element.classList).includes(styles.infoBox)
            )
              return;
        }
        setIsInfoVisible(false);
      }
    },
    [isInfoVisible],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  const handleSwitchClick = layer => () => {
    if (!hasMadeChanges) setHasMadeChanges(true);

    // Remove if already selected, otherwise add to list of selected layers.
    const selectedLayer = selectedLayers.find(
      selected => selected.metadata.label === layer.metadata.label,
    );

    if (selectedLayer) {
      setSelectedLayers(
        selectedLayers.filter(
          lyr => lyr.metadata.label !== selectedLayer.metadata.label,
        ),
      );
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
    for (const layer of initialSelectedLayers) {
      if (!selectedLayers.includes(layer)) onRemoveLayer(layer);
    }

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
                domain.layers.map((layer, i) => {
                  const isSelected = !!selectedLayers.find(
                    selected => layer.name === selected.name,
                  );
                  return (
                    <li
                      key={layer.metadata.label}
                      className={styles.row}
                      data-testid={`layer-list-item-${layer.name}`}
                    >
                      <Switch
                        name={layer.name}
                        value={layer.name}
                        label={layer.metadata.label}
                        onClick={handleSwitchClick(layer)}
                        ariaLabel={layer.metadata.label}
                        checked={isSelected}
                      />
                      {isInfoVisible && info.name === layer.name && (
                        <InfoBox className={styles.infoBox} arrow="right">
                          {layer.metadata.description}
                        </InfoBox>
                      )}
                      <InfoButton
                        classNames={[styles.info]}
                        onClick={handleInfoClick(layer)}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          <div
            className={dialogStyles.noOrbSelected}
            data-testid="layer-select-no-domain-message"
          >
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
          Accept
        </Button>
      </div>
    </div>
  );
};
