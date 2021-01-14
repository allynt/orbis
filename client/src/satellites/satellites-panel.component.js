import React, { useState, useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button, Dialog /*useModal*/ } from '@astrosat/astrosat-ui';

import {
  fetchSatellites,
  selectScene,
  fetchPinnedScenes,
  selectPinnedScene,
  deselectPinnedScene,
  clearSelectedPinnedScenes,
  deletePinnedScene,
  pinScene,
  saveSatelliteSearch,
  removeScenes,
  setCurrentVisualisation,
  selectedPinnedScenesSelector,
} from './satellites.slice';

import { toggleCompareMode, isCompareModeSelector } from '../map/map.slice';

import SatelliteSearch from './satellite-search.component';
import Results from './results.component';
import Visualisation from './visualisation.component';
import ComparePins from './compare-pins.component';
import {
  SatelliteInfoTable,
  TierInfoTable,
  SceneInfoTable,
} from './satellites-info-tables.component';

import styles from './satellites-panel.module.css';

export const SEARCH = 'Search';
export const RESULTS = 'Results';
export const VISUALISATION = 'Visualisation';
export const PINS = 'Pins';

export const SATELLITE = 'Satellite';
export const SCENE = 'Scene';
export const TIER = 'Tier';

const SatellitesPanel = ({ map }) => {
  const dispatch = useDispatch();
  const dialogRef = useRef(null);

  const [visiblePanel, setVisiblePanel] = useState(SEARCH);
  const [visualisations, setVisualisations] = useState(null);
  const [selectedMoreInfo, setSelectedMoreInfo] = useState({
    type: null,
    data: null,
  });

  // const [isMoreInfoDialogVisible, toggleMoreInfoDialog] = useModal(false);

  const satellites = useSelector(state => state.satellites.satellites);
  const scenes = useSelector(state => state.satellites.scenes);
  const selectedScene = useSelector(state => state.satellites.selectedScene);

  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);
  const isCompareMode = useSelector(isCompareModeSelector);
  const selectedPinnedScenes = useSelector(selectedPinnedScenesSelector);
  const currentSearchQuery = useSelector(
    state => state.satellites.currentSearchQuery,
  );

  useEffect(() => {
    if (!satellites) {
      dispatch(fetchSatellites());
    }
  }, [satellites, dispatch]);

  useEffect(() => {
    if (!pinnedScenes) {
      dispatch(fetchPinnedScenes());
    }
  }, [pinnedScenes, dispatch]);

  useEffect(() => {
    if (selectedScene) {
      const satellite = satellites.find(
        sat => sat.id === selectedScene.satellite,
      );
      setVisualisations(satellite.visualisations);
    }
  }, [satellites, selectedScene]);

  return (
    <div className={styles.panel}>
      <div className={styles.navigationPanel}>
        <Button
          theme="primary"
          className={
            visiblePanel === SEARCH
              ? [styles.button, styles.active]
              : [styles.button]
          }
          onClick={() => setVisiblePanel(SEARCH)}
        >
          Search
        </Button>
        <Button
          theme="primary"
          disabled={!scenes}
          className={
            visiblePanel === RESULTS
              ? [styles.button, styles.active]
              : [styles.button]
          }
          onClick={() => setVisiblePanel(RESULTS)}
        >
          Results
        </Button>
        <Button
          theme="primary"
          disabled={!visualisations}
          className={
            visiblePanel === VISUALISATION
              ? [styles.button, styles.active]
              : [styles.button]
          }
          onClick={() => setVisiblePanel(VISUALISATION)}
        >
          Visualisation
        </Button>
        <Button
          theme="primary"
          className={
            visiblePanel === PINS
              ? [styles.button, styles.active]
              : [styles.button]
          }
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
            // toggleMoreInfoDialog={toggleMoreInfoDialog}
            ref={dialogRef}
          />
        )}
        {visiblePanel === RESULTS && (
          <Results
            setVisiblePanel={setVisiblePanel}
            scenes={scenes}
            selectScene={scene => dispatch(selectScene(scene))}
            setSelectedMoreInfo={setSelectedMoreInfo}
            // toggleMoreInfoDialog={toggleMoreInfoDialog}
            pinnedScenes={pinnedScenes}
            pinScene={scene => dispatch(pinScene(scene))}
            deletePinnedScene={id => dispatch(deletePinnedScene(id))}
            saveSatelliteSearch={query => dispatch(saveSatelliteSearch(query))}
            currentSearchQuery={currentSearchQuery}
            ref={dialogRef}
          />
        )}
        {visiblePanel === VISUALISATION && (
          <Visualisation
            visualisations={visualisations}
            setVisiblePanel={setVisiblePanel}
            removeScenes={() => dispatch(removeScenes())}
            setCurrentVisualisation={visualisation =>
              dispatch(setCurrentVisualisation(visualisation))
            }
          />
        )}
        {visiblePanel === PINS && (
          <ComparePins
            setSelectedMoreInfo={setSelectedMoreInfo}
            // toggleMoreInfoDialog={toggleMoreInfoDialog}
            selectPinnedScene={scene => dispatch(selectPinnedScene(scene))}
            deselectPinnedScene={scene => dispatch(deselectPinnedScene(scene))}
            clearSelectedPinnedScenes={() =>
              dispatch(clearSelectedPinnedScenes())
            }
            deletePinnedScene={id => dispatch(deletePinnedScene(id))}
            toggleCompareMode={() => dispatch(toggleCompareMode())}
            pinnedScenes={pinnedScenes}
            selectedPinnedScenes={selectedPinnedScenes}
            isCompareMode={isCompareMode}
            ref={dialogRef}
          />
        )}
      </div>
      <Dialog
        // isVisible={isMoreInfoDialogVisible}
        title="More Information"
        // close={toggleMoreInfoDialog}
        ref={dialogRef}
      >
        {!selectedMoreInfo && (
          <p className={styles.noInfoAvailable}>
            No information currently available
          </p>
        )}

        {selectedMoreInfo && selectedMoreInfo.type === SATELLITE && (
          <SatelliteInfoTable satellite={selectedMoreInfo.data} />
        )}
        {selectedMoreInfo && selectedMoreInfo.type === SCENE && (
          <SceneInfoTable scene={selectedMoreInfo.data} />
        )}
        {selectedMoreInfo && selectedMoreInfo.type === TIER && (
          <TierInfoTable tier={selectedMoreInfo.data} />
        )}
      </Dialog>
    </div>
  );
};

export default SatellitesPanel;
