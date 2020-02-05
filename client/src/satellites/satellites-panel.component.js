import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { fetchSatellites, selectScene, fetchVisualisations } from './satellites.actions';

import Search from './search.component';
import Results from './results.component';
import Visualisation from './visualisation.component';

import { ReactComponent as SearchIcon } from './search.svg';
import { ReactComponent as ResultsIcon } from './results.svg';
import { ReactComponent as VisualisationIcon } from './visualisation.svg';

import styles from './satellites-panel.module.css';

export const SEARCH = 'Search';
export const RESULTS = 'Results';
export const VISUALISATION = 'Visualisation';

const SatellitesPanel = () => {
  const dispatch = useDispatch();

  const [visiblePanel, setVisiblePanel] = useState(SEARCH);
  const satellites = useSelector(state => state.satellites.satellites);
  const scenes = useSelector(state => state.satellites.scenes);
  const visualisations = useSelector(state => state.satellites.visualisations);

  useEffect(() => {
    if (!satellites) {
      dispatch(fetchSatellites());
    }
  }, [satellites]);

  useEffect(() => {
    if (!visualisations) {
      dispatch(fetchVisualisations());
    }
  }, [visualisations]);

  return (
    <div className={styles.panel}>
      <div className={styles.topPanel}>
        <Button
          theme="primary"
          classNames={visiblePanel === SEARCH ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(SEARCH)}
        >
          <SearchIcon className={styles.icon} />
          Search
        </Button>
        <Button
          theme="primary"
          classNames={visiblePanel === RESULTS ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(RESULTS)}
        >
          <ResultsIcon className={styles.icon} />
          Results
        </Button>
        <Button
          theme="primary"
          classNames={visiblePanel === VISUALISATION ? [styles.button, styles.active] : [styles.button]}
          onClick={() => setVisiblePanel(VISUALISATION)}
        >
          <VisualisationIcon className={styles.icon} />
          Visualisation
        </Button>
      </div>

      <div className={styles.bottomPanel}>
        {satellites && visiblePanel === SEARCH && <Search satellites={satellites} setVisiblePanel={setVisiblePanel} />}
        {visiblePanel === RESULTS && (
          <Results setVisiblePanel={setVisiblePanel} scenes={scenes} selectScene={selectScene} />
        )}
        {visiblePanel === VISUALISATION && (
          <Visualisation visualisations={visualisations} setVisiblePanel={setVisiblePanel} />
        )}
      </div>
    </div>
  );
};

SatellitesPanel.propTypes = {};

export default SatellitesPanel;
