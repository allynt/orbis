import React, { useEffect, useState } from 'react';

import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import Results from './results/results.component';
import SatelliteSearch from './satellite-search/satellite-search.component';
import {
  SatelliteInfoTable,
  SceneInfoTable,
  TierInfoTable,
} from './satellites-info-tables/satellites-info-tables.component';
import {
  deletePinnedScene,
  deleteSavedSatelliteSearch,
  fetchPinnedScenes,
  fetchSatellites,
  fetchSatelliteScenes,
  fetchSavedSatelliteSearches,
  pinScene,
  saveSatelliteSearch,
  selectScene,
  setCurrentSatelliteSearchQuery,
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

const Satellites = () => {
  const dispatch = useDispatch();

  const [visiblePanel, setVisiblePanel] = useState(SEARCH);
  const [selectedMoreInfo, setSelectedMoreInfo] = useState({
    type: null,
    data: null,
  });
  const [isMoreInfoDialogVisible, setIsMoreInfoDialogVisible] = useState(false);

  const satellites = useSelector(state => state.satellites.satellites);
  const scenes = useSelector(state => state.satellites.scenes);
  const selectedScene = useSelector(state => state.satellites.selectedScene);
  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);
  const currentSearchQuery = useSelector(
    state => state.satellites.currentSearchQuery,
  );
  const visualisationId = useSelector(
    state => state.satellites.visualisationId,
  );
  const savedSearches = useSelector(
    state => state.satellites.satelliteSearches,
  );
  const visualisations = satellites?.find(
    sat => sat.id === selectedScene?.satellite,
  )?.visualisations;

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
    if (!savedSearches) {
      dispatch(fetchSavedSatelliteSearches());
    }
  }, [savedSearches, dispatch]);

  /**
   * @param {{type: string, data: any}} info
   */
  const handleInfoClick = info => {
    setSelectedMoreInfo(info);
    setIsMoreInfoDialogVisible(c => !c);
  };

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
        {/* <Button onClick={() => setVisiblePanel(PINS)}>My Pins</Button> */}
      </ButtonGroup>

      {satellites && visiblePanel === SEARCH && (
        <SatelliteSearch
          satellites={satellites}
          savedSearches={savedSearches}
          currentSearch={currentSearchQuery}
          onDrawAoiClick={() => console.log('Draw AOI Click')}
          onSearch={search => {
            const newSearch = { ...search, aoi: [[]] };
            dispatch(setCurrentSatelliteSearchQuery(newSearch));
            dispatch(fetchSatelliteScenes(newSearch));
            setVisiblePanel(RESULTS);
          }}
          onSearchReload={search =>
            dispatch(setCurrentSatelliteSearchQuery(search))
          }
          onSearchDelete={({ id }) => dispatch(deleteSavedSatelliteSearch(id))}
          onInfoClick={handleInfoClick}
        />
      )}
      {visiblePanel === RESULTS && (
        <Results
          scenes={scenes}
          pinnedScenes={pinnedScenes}
          visualisationId={visualisationId}
          onSceneClick={scene => dispatch(selectScene(scene))}
          onScenePin={scene => dispatch(pinScene(scene))}
          onSceneUnpin={scene => dispatch(deletePinnedScene(scene.id))}
          onInfoClick={handleInfoClick}
          onSaveSearchSubmit={name =>
            dispatch(saveSatelliteSearch({ ...currentSearchQuery, name }))
          }
        />
      )}
      {visiblePanel === VISUALISATION && (
        <Visualisation
          visualisations={visualisations}
          onVisualisationClick={visualisation =>
            dispatch(setCurrentVisualisation(visualisation))
          }
        />
      )}
      {/* {visiblePanel === PINS && (
        <ComparePins
          onInfoClick={handleInfoClick}
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
      )} */}
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
