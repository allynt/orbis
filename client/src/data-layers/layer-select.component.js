import React, { useState } from 'react';

import InfoButton from '@astrosat/astrosat-ui/dist/buttons/info-button';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';

import styles from './data-layers-dialog.module.css';

const InfoBox = ({ info }) => <div className={styles.infoBox}>{info}</div>;

export const LayerSelect = ({ domain, onAddLayers }) => {
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);

  return (
    <div className={styles.subcategories}>
      <div className={styles.header}>
        <h3>Select Your Layers</h3>
      </div>
      {domain && (
        <div className={styles.subCategoryOptions}>
          <ul>
            {domain &&
              domain.layers.map(layer => {
                return (
                  <li key={layer.metadata.label}>
                    <div className={styles.row}>
                      <Switch
                        name={layer.name}
                        value={layer.name}
                        label={layer.metadata.label}
                        onClick={() => {
                          // Remove if already selected, otherwise add to list of selected layers.
                          const selectedLayer = selectedLayers.find(
                            selected => selected.metadata.label === layer.metadata.label
                          );

                          selectedLayer
                            ? setSelectedLayers(
                                selectedLayers.filter(lyr => lyr.metadata.label !== selectedLayer.metadata.label)
                              )
                            : setSelectedLayers([...selectedLayers, layer]);
                        }}
                        ariaLabel={layer.metadata.label}
                      />

                      {isInfoVisible && info.name === layer.name && <InfoBox info={layer.metadata.description} />}

                      <InfoButton
                        classNames={[styles.info]}
                        onClick={() => {
                          setIsInfoVisible(!isInfoVisible);
                          setInfo(layer);
                        }}
                      />
                    </div>
                    {selectedLayers.find(selected => selected.metadata.label === layer.metadata.label) &&
                      layer.metadata.range && <div>START/END DATE</div>}
                  </li>
                );
              })}
          </ul>

          <div className={styles.buttons}>
            <Button onClick={() => onAddLayers(selectedLayers)} theme="primary" disabled={selectedLayers.length === 0}>
              Add
            </Button>
          </div>
        </div>
      )}
      {!domain && <div>No Domain selected</div>}
    </div>
  );
};
