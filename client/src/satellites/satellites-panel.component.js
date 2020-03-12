import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

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

  const [visiblePanel, setVisiblePanel] = useState(SEARCH);
  const [visualisations, setVisualisations] = useState(null);

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
          classNames={visiblePanel === RESULTS ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(RESULTS)}
        >
          Results
        </Button>
        <Button
          theme="primary"
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
          <SatelliteSearch satellites={satellites} setVisiblePanel={setVisiblePanel} map={map} />
        )}
        {visiblePanel === RESULTS && (
          <Results setVisiblePanel={setVisiblePanel} scenes={scenes} selectScene={selectScene} />
        )}
        {visiblePanel === VISUALISATION && (
          <Visualisation visualisations={visualisations} setVisiblePanel={setVisiblePanel} />
        )}
        {visiblePanel === PINS && <PinnedScenes />}
      </div>
    </div>
  );
};

SatellitesPanel.propTypes = {};

export default SatellitesPanel;
