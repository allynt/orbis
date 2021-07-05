import React, { useEffect, useState } from 'react';

import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { isCompareModeSelector, toggleCompareMode } from '../map/map.slice';
import ComparePins from './compare-pins/compare-pins.component';
import Results from './results/results.component';
import SatelliteSearch from './satellite-search/satellite-search.component';
import {
  SatelliteInfoTable,
  SceneInfoTable,
  TierInfoTable,
} from './satellites-info-tables/satellites-info-tables.component';
import {
  clearSelectedPinnedScenes,
  deletePinnedScene,
  deselectPinnedScene,
  fetchPinnedScenes,
  fetchSatellites,
  pinScene,
  removeScenes,
  saveSatelliteSearch,
  selectedPinnedScenesSelector,
  selectPinnedScene,
  selectScene,
  setCurrentVisualisation,
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

  const [visiblePanel, setVisiblePanel] = useState(SEARCH);
  const [visualisations, setVisualisations] = useState(null);
  const [selectedMoreInfo, setSelectedMoreInfo] = useState({
    type: null,
    data: null,
  });

  const [isMoreInfoDialogVisible, setIsMoreInfoDialogVisible] = useState(false);

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
    <>
      <ButtonGroup
        size="small"
        orientation="vertical"
        aria-label="small outlined primary button group"
      >
        <Button onClick={() => setVisiblePanel(SEARCH)}>Search</Button>
        <Button disabled={!scenes} onClick={() => setVisiblePanel(RESULTS)}>
          Results
        </Button>
        <Button
          disabled={!visualisations}
          onClick={() => setVisiblePanel(VISUALISATION)}
        >
          Visualisation
        </Button>
        <Button onClick={() => setVisiblePanel(PINS)}>My Pins</Button>
      </ButtonGroup>

      {satellites && visiblePanel === SEARCH && (
        <SatelliteSearch
          map={map}
          satellites={satellites}
          setVisiblePanel={setVisiblePanel}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={() => setIsMoreInfoDialogVisible(c => !c)}
        />
      )}
      {visiblePanel === RESULTS && (
        <Results
          setVisiblePanel={setVisiblePanel}
          scenes={scenes}
          selectScene={scene => dispatch(selectScene(scene))}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={() => setIsMoreInfoDialogVisible(c => !c)}
          pinnedScenes={pinnedScenes}
          pinScene={scene => dispatch(pinScene(scene))}
          deletePinnedScene={id => dispatch(deletePinnedScene(id))}
          saveSatelliteSearch={query => dispatch(saveSatelliteSearch(query))}
          currentSearchQuery={currentSearchQuery}
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
          toggleMoreInfoDialog={() => setIsMoreInfoDialogVisible(c => !c)}
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
        />
      )}
      <Dialog
        open={isMoreInfoDialogVisible}
        onClose={() => setIsMoreInfoDialogVisible(false)}
      >
        <DialogTitle>More Information</DialogTitle>
        <DialogContent>
          {!selectedMoreInfo && <p>No information currently available</p>}

          {selectedMoreInfo && selectedMoreInfo.type === SATELLITE && (
            <SatelliteInfoTable satellite={selectedMoreInfo.data} />
          )}
          {selectedMoreInfo && selectedMoreInfo.type === SCENE && (
            <SceneInfoTable scene={selectedMoreInfo.data} />
          )}
          {selectedMoreInfo && selectedMoreInfo.type === TIER && (
            <TierInfoTable tier={selectedMoreInfo.data} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Satellites;
