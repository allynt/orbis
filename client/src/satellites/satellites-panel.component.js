import React, { useState, useEffect, useRef } from 'react';

import {
  Button,
  ButtonGroup,
  Dialog /*useModal*/,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { toggleCompareMode, isCompareModeSelector } from '../map/map.slice';
import ComparePins from './compare-pins/compare-pins.component';
import Results from './results/results.component';
import SatelliteSearch from './satellite-search/satellite-search.component';
import {
  SatelliteInfoTable,
  TierInfoTable,
  SceneInfoTable,
} from './satellites-info-tables/satellites-info-tables.component';
import styles from './satellites-panel.module.css';
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
import Visualisation from './visualisation/visualisation.component';

export const SEARCH = 'Search';
export const RESULTS = 'Results';
export const VISUALISATION = 'Visualisation';
export const PINS = 'Pins';

export const SATELLITE = 'Satellite';
export const SCENE = 'Scene';
export const TIER = 'Tier';

const Satellites = ({ map }) => {
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

  // console.log('VISIBLE PANEL: ', visiblePanel);
  // console.log('SATELLITES: ', satellites);

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
        <ButtonGroup
          size="small"
          color="primary"
          aria-label="small outlined primary button group"
        >
          <Button
            // theme="primary"
            // className={
            //   visiblePanel === SEARCH
            //     ? [styles.button, styles.active]
            //     : [styles.button]
            // }
            onClick={() => setVisiblePanel(SEARCH)}
          >
            Search
          </Button>
          <Button
            // theme="primary"
            disabled={!scenes}
            // className={
            //   visiblePanel === RESULTS
            //     ? [styles.button, styles.active]
            //     : [styles.button]
            // }
            onClick={() => setVisiblePanel(RESULTS)}
          >
            Results
          </Button>
          <Button
            // theme="primary"
            disabled={!visualisations}
            // className={
            //   visiblePanel === VISUALISATION
            //     ? [styles.button, styles.active]
            //     : [styles.button]
            // }
            onClick={() => setVisiblePanel(VISUALISATION)}
          >
            Visualisation
          </Button>
          <Button
            // theme="primary"
            // className={
            //   visiblePanel === PINS
            //     ? [styles.button, styles.active]
            //     : [styles.button]
            // }
            onClick={() => setVisiblePanel(PINS)}
          >
            My Pins
          </Button>
        </ButtonGroup>
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
      {/* <Dialog
        // isVisible={isMoreInfoDialogVisible}
        title="More Information"
        open={true}
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
      </Dialog> */}
    </div>
  );
};

export default Satellites;
