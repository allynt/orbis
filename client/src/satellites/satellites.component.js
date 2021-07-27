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
import { Panels } from './satellite.constants';
import {
  currentSearchQuerySelector,
  fetchSatellites,
  searchSatelliteScenes,
  hoveredSceneSelector,
  satellitesSelector,
  saveImage,
  scenesSelector,
  selectedSceneSelector,
  selectScene,
  setVisualisationId,
  setHoveredScene,
  visualisationIdSelector,
  cloudCoverPercentageSelector,
  setCloudCoverPercentage,
  selectedSceneLayerVisibleSelector,
  setSelectedSceneLayerVisible,
  visiblePanelSelector,
  setVisiblePanel,
  aoiSelector,
  startDrawingAoi,
} from './satellites.slice';
import Search from './search/search.component';
import Visualisation from './visualisation/visualisation.component';

const useStyles = makeStyles(theme => ({
  tab: { minWidth: '72px' },
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  container: {
    height: 'calc(100% - 50px)',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 1, 3),
  },
}));

const Satellites = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [selectedMoreInfo, setSelectedMoreInfo] = useState({
    type: null,
    data: null,
  });
  const [isMoreInfoDialogVisible, setIsMoreInfoDialogVisible] = useState(false);

  const satellites = useSelector(satellitesSelector);
  const scenes = useSelector(scenesSelector);
  const hoveredScene = useSelector(hoveredSceneSelector);
  const selectedScene = useSelector(selectedSceneSelector);
  const currentSearchQuery = useSelector(currentSearchQuerySelector);
  const visualisationId = useSelector(visualisationIdSelector);
  const cloudCoverPercentage = useSelector(cloudCoverPercentageSelector);
  const selectedSceneLayerVisible = useSelector(
    selectedSceneLayerVisibleSelector,
  );
  const visiblePanel = useSelector(visiblePanelSelector);
  const visualisations = satellites?.find(
    sat => sat.id === selectedScene?.satellite,
  )?.visualisations;
  const aoi = useSelector(aoiSelector);

  useEffect(() => {
    if (!satellites) {
      dispatch(fetchSatellites());
    }
  }, [satellites, dispatch]);

  useEffect(() => {
    if (visiblePanel === Panels.VISUALISATION) {
      dispatch(setSelectedSceneLayerVisible(true));
    }
    return () => {
      dispatch(setSelectedSceneLayerVisible(false));
    };
  }, [visiblePanel, dispatch]);

  /**
   * @param {{type: string, data: any}} info
   */
  const handleInfoClick = info => {
    setSelectedMoreInfo(info);
    setIsMoreInfoDialogVisible(c => !c);
  };

  return (
    <div className={styles.wrapper}>
      <Tabs
        variant="standard"
        scrollButtons="on"
        value={visiblePanel}
        onChange={(_event, value) => dispatch(setVisiblePanel(value))}
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
      <div className={styles.container}>
        {satellites && visiblePanel === Panels.SEARCH && (
          <Search
            satellites={satellites}
            aoi={aoi}
            currentSearch={currentSearchQuery}
            onDrawAoiClick={() => dispatch(startDrawingAoi())}
            onSearch={search => {
              dispatch(searchSatelliteScenes(search));
            }}
            onInfoClick={handleInfoClick}
          />
        )}
        {visiblePanel === Panels.RESULTS && (
          <Results
            scenes={scenes}
            hoveredScene={hoveredScene}
            selectedScene={selectedScene}
            visualisationId={visualisationId}
            cloudCoverPercentage={cloudCoverPercentage}
            onCloudCoverSliderChange={value =>
              dispatch(setCloudCoverPercentage(value))
            }
            onSceneHover={scene => {
              dispatch(setHoveredScene(scene));
            }}
            onSceneClick={scene => {
              dispatch(selectScene(scene));
            }}
          />
        )}
        {visiblePanel === Panels.VISUALISATION && (
          <Visualisation
            visualisations={visualisations}
            visualisationId={visualisationId}
            onVisualisationClick={visualisation =>
              dispatch(setVisualisationId(visualisation))
            }
            visible={selectedSceneLayerVisible}
            onVisibilityChange={checked => {
              dispatch(setSelectedSceneLayerVisible(checked));
            }}
            onSaveImageSubmit={formValues => dispatch(saveImage(formValues))}
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
      </div>
      <MoreInfoDialog
        open={isMoreInfoDialogVisible}
        onClose={() => setIsMoreInfoDialogVisible(false)}
        {...selectedMoreInfo}
      />
    </div>
  );
};

export default Satellites;
