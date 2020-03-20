import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import { fetchSatellites, selectScene, fetchVisualisations } from './satellites.actions';

import SatelliteSearch from './satellite-search.component';
import Results from './results.component';
import Visualisation from './visualisation.component';
import PinnedScenes from './compare-pins.component';

import styles from './satellites-panel.module.css';

export const SEARCH = 'Search';
export const RESULTS = 'Results';
export const VISUALISATION = 'Visualisation';
export const PINS = 'Pins';

const SatellitesPanel = ({ map }) => {
  const dispatch = useDispatch();
  const dialogRef = useRef(null);

  const [visiblePanel, setVisiblePanel] = useState(SEARCH);
  const [visualisations, setVisualisations] = useState(null);
  const [selectedMoreInfo, setSelectedMoreInfo] = useState(null);

  const [isMoreInfoDialogVisible, toggleMoreInfoDialog] = useModal(false);

  const satellites = useSelector(state => state.satellites.satellites);
  const scenes = useSelector(state => state.satellites.scenes);
  const selectedScene = useSelector(state => state.satellites.selectedScene);

  useEffect(() => {
    if (!satellites) {
      dispatch(fetchSatellites());
    }
  }, [satellites]);

  useEffect(() => {
    if (selectedScene) {
      const satellite = satellites.find(sat => sat.id === selectedScene.satellite);
      setVisualisations(satellite.visualisations);
    }
  }, [satellites, selectedScene]);

  return (
    <div className={styles.panel}>
      <div className={styles.navigationPanel}>
        <Button
          theme="primary"
          classNames={visiblePanel === SEARCH ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(SEARCH)}
        >
          Search
        </Button>
        <Button
          theme="primary"
          disabled={!scenes}
          classNames={visiblePanel === RESULTS ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(RESULTS)}
        >
          Results
        </Button>
        <Button
          theme="primary"
          disabled={!visualisations}
          classNames={visiblePanel === VISUALISATION ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(VISUALISATION)}
        >
          Visualisation
        </Button>
        <Button
          theme="primary"
          classNames={visiblePanel === PINS ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(PINS)}
        >
          My Pins
        </Button>
      </div>

      <div className={styles.content}>
        {satellites && visiblePanel === SEARCH && (
          <SatelliteSearch
            map={map}
            satellites={satellites}
            setVisiblePanel={setVisiblePanel}
            setSelectedMoreInfo={setSelectedMoreInfo}
            toggleMoreInfoDialog={toggleMoreInfoDialog}
            ref={dialogRef}
          />
        )}
        {visiblePanel === RESULTS && (
          <Results
            setVisiblePanel={setVisiblePanel}
            scenes={scenes}
            selectScene={selectScene}
            setSelectedMoreInfo={setSelectedMoreInfo}
            toggleMoreInfoDialog={toggleMoreInfoDialog}
            ref={dialogRef}
          />
        )}
        {visiblePanel === VISUALISATION && (
          <Visualisation visualisations={visualisations} setVisiblePanel={setVisiblePanel} />
        )}
        {visiblePanel === PINS && (
          <PinnedScenes
            setSelectedMoreInfo={setSelectedMoreInfo}
            toggleMoreInfoDialog={toggleMoreInfoDialog}
            ref={dialogRef}
          />
        )}
      </div>
      <Dialog isVisible={isMoreInfoDialogVisible} title="More Info" close={toggleMoreInfoDialog} ref={dialogRef}>
        <div className={styles.moreInfoContent}>
          <table>
            <tbody>
              {selectedMoreInfo &&
                Object.keys(selectedMoreInfo).map(key => {
                  if (typeof selectedMoreInfo[key] === 'object') {
                    console.log('OBJ: ', selectedMoreInfo[key]);
                    return (
                      <tr key={key}>
                        <td>{key}:</td>
                        <td>This field is an object or array</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={key}>
                      <td>{key}:</td>
                      <td>{selectedMoreInfo[key]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Dialog>
    </div>
  );
};

SatellitesPanel.propTypes = {};

export default SatellitesPanel;
