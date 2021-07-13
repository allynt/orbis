import React, { useEffect, useState } from 'react';

import {
  makeStyles,
  ResultsIcon,
  SearchIcon,
  Tab,
  Tabs,
  VisualisationIcon,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { MoreInfoDialog } from './more-info-dialog/more-info-dialog.component';
import Results from './results/results.component';
import SatelliteSearch from './satellite-search/satellite-search.component';
import { useSatellites } from './satellites-context';
import {
  currentSearchQuerySelector,
  deletePinnedScene,
  fetchPinnedScenes,
  fetchSatellites,
  fetchSatelliteScenes,
  pinnedScenesSelector,
  pinScene,
  satellitesSelector,
  scenesSelector,
  selectedSceneSelector,
  selectScene,
  setCurrentSatelliteSearchQuery,
  setCurrentVisualisation,
  visualisationIdSelector,
} from './satellites.slice';
import Visualisation from './visualisation/visualisation.component';

const Panels = {
  SEARCH: 'Search',
  RESULTS: 'Results',
  VISUALISATION: 'Visualisation',
};

const useStyles = makeStyles({ tab: { minWidth: '72px' } });

const Satellites = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [visiblePanel, setVisiblePanel] = useState(Panels.SEARCH);
  const [selectedMoreInfo, setSelectedMoreInfo] = useState({
    type: null,
    data: null,
  });
  const [isMoreInfoDialogVisible, setIsMoreInfoDialogVisible] = useState(false);

  const satellites = useSelector(satellitesSelector);
  const scenes = useSelector(scenesSelector);
  const selectedScene = useSelector(selectedSceneSelector);
  const pinnedScenes = useSelector(pinnedScenesSelector);
  const currentSearchQuery = useSelector(currentSearchQuerySelector);
  const visualisationId = useSelector(visualisationIdSelector);
  const visualisations = satellites?.find(
    sat => sat.id === selectedScene?.satellite,
  )?.visualisations;
  const {
    setIsDrawingAoi,
    aoi,
    cloudCoverPercentage,
    setCloudCover,
  } = useSatellites();

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

  /**
   * @param {{type: string, data: any}} info
   */
  const handleInfoClick = info => {
    setSelectedMoreInfo(info);
    setIsMoreInfoDialogVisible(c => !c);
  };

  return (
    <>
      <Tabs
        variant="standard"
        scrollButtons="on"
        value={visiblePanel}
        onChange={(_event, value) => setVisiblePanel(value)}
      >
        <Tab
          className={styles.tab}
          icon={<SearchIcon titleAccess="Search" />}
          value={Panels.SEARCH}
        />
        <Tab
          className={styles.tab}
          icon={<ResultsIcon titleAccess="Results" />}
          value={Panels.RESULTS}
          disabled={!scenes}
        />
        <Tab
          className={styles.tab}
          icon={<VisualisationIcon titleAccess="Visualisation" />}
          value={Panels.VISUALISATION}
          disabled={!visualisations}
        />
      </Tabs>
      {satellites && visiblePanel === Panels.SEARCH && (
        <SatelliteSearch
          satellites={satellites}
          aoi={aoi}
          currentSearch={currentSearchQuery}
          onDrawAoiClick={() => setIsDrawingAoi(c => !c)}
          onSearch={search => {
            const newSearch = { ...search, aoi };
            dispatch(setCurrentSatelliteSearchQuery(newSearch));
            dispatch(fetchSatelliteScenes(newSearch));
            setVisiblePanel(Panels.RESULTS);
          }}
          onInfoClick={handleInfoClick}
        />
      )}
      {visiblePanel === Panels.RESULTS && (
        <Results
          scenes={scenes}
          selectedScene={selectedScene}
          pinnedScenes={pinnedScenes}
          visualisationId={visualisationId}
          cloudCoverPercentage={cloudCoverPercentage}
          onCloudCoverSliderChange={setCloudCover}
          onSceneClick={scene => {
            dispatch(selectScene(scene));
            setVisiblePanel(Panels.VISUALISATION);
          }}
          onScenePin={scene => dispatch(pinScene(scene))}
          onSceneUnpin={scene => dispatch(deletePinnedScene(scene.id))}
          onInfoClick={handleInfoClick}
        />
      )}
      {visiblePanel === Panels.VISUALISATION && (
        <Visualisation
          visualisations={visualisations}
          visualisationId={visualisationId}
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
      <MoreInfoDialog
        open={isMoreInfoDialogVisible}
        onClose={() => setIsMoreInfoDialogVisible(false)}
        {...selectedMoreInfo}
      />
    </>
  );
};

export default Satellites;
