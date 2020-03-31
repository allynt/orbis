import React, { useRef, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { useDispatch, useSelector } from 'react-redux';

import CloseButton from '@astrosat/astrosat-ui/dist/buttons/close-button';
import InfoButton from '@astrosat/astrosat-ui/dist/buttons/info-button';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';

import { addLayers } from './data-layers-dialog.actions';

import styles from './data-layers-dialog.module.css';

const InfoBox = ({ info }) => <div className={styles.infoBox}>{info}</div>;

const DataLayersDialog = ({ isVisible, close, title }, ref) => {
  const overlayRef = useRef(null);

  const dispatch = useDispatch();
  const domains = useSelector(state => state.map.dataSources);

  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState([]);

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);

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
            <div className={styles.content}>
              <div className={styles.categories}>
                <div className={styles.header}>
                  <h3 className={styles.title}>Select Your Categories</h3>
                </div>

                <div className={styles.content}>
                  <ul>
                    {domains.map(domain => (
                      <li key={domain.label} onClick={() => setSelectedDomain(domain)}>
                        {domain.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.subcategories}>
                <div className={styles.header}>
                  <h3 className={styles.title}>Select Your subcategories</h3>
                  <CloseButton onClick={close} ariaLabel="Close" />
                </div>

                <div className={styles.content}>
                  {selectedDomain && (
                    <div className={styles.subCategoryOptions}>
                      <ul>
                        {selectedDomain &&
                          selectedDomain.layers.map(layer => {
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
                                            selectedLayers.filter(
                                              lyr => lyr.metadata.label !== selectedLayer.metadata.label
                                            )
                                          )
                                        : setSelectedLayers([...selectedLayers, layer]);
                                    }}
                                    ariaLabel={layer.metadata.label}
                                  />

                                  {isInfoVisible && info.name === layer.name && (
                                    <InfoBox info={layer.metadata.description} />
                                  )}

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
                        <Button
                          onClick={() => dispatch(addLayers(selectedLayers))}
                          theme="primary"
                          disabled={selectedLayers.length === 0}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                  {!selectedDomain && <div>No Domain selected</div>}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default React.memo(React.forwardRef(DataLayersDialog));
