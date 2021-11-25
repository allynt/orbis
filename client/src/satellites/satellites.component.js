import React, { useEffect, useMemo, useState } from 'react';

import {
  makeStyles,
  ResultsIcon,
  SearchIcon,
  Tab,
  Tabs,
  VisualisationIcon,
} from '@astrosat/astrosat-ui';

import { area, convertArea, geometry } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';

import { configSelector } from 'app.slice';

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
  satelliteAoiSelector,
  startDrawingSatelliteAoi,
  onSatelliteUnmount,
  requestsSelector,
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

const SearchView = () => {
  const dispatch = useDispatch();
  const appConfig = useSelector(configSelector);
  const satellites = useSelector(satellitesSelector);
  const aoi = useSelector(satelliteAoiSelector);
  const currentSearchQuery = useSelector(currentSearchQuerySelector);
  const [selectedMoreInfo, setSelectedMoreInfo] = useState({
    type: null,
    data: null,
  });
  const [isMoreInfoDialogVisible, setIsMoreInfoDialogVisible] = useState(false);
  const aoiTooLarge = useMemo(
    () =>
      aoi &&
      convertArea(area(geometry('Polygon', [aoi])), 'meters', 'kilometers') >
        appConfig?.maximumAoiArea,
    [aoi, appConfig],
  );

  /**
   * @param {{type: string, data: any}} info
   */
  const handleInfoClick = info => {
    setSelectedMoreInfo(info);
    setIsMoreInfoDialogVisible(c => !c);
  };

  return satellites ? (
    <>
      <Search
        satellites={satellites}
        aoi={aoi}
        aoiTooLarge={aoiTooLarge}
        currentSearch={currentSearchQuery}
        onDrawAoiClick={() => dispatch(startDrawingSatelliteAoi())}
        onSearch={search => {
          dispatch(searchSatelliteScenes(search));
        }}
        onInfoClick={handleInfoClick}
      />
      <MoreInfoDialog
        open={isMoreInfoDialogVisible}
        onClose={() => setIsMoreInfoDialogVisible(false)}
        {...selectedMoreInfo}
      />
    </>
  ) : null;
};

const ResultsView = () => {
  const scenes = useSelector(scenesSelector);
  const hoveredScene = useSelector(hoveredSceneSelector);
  const visualisationId = useSelector(visualisationIdSelector);
  const selectedScene = useSelector(selectedSceneSelector);
  const cloudCoverPercentage = useSelector(cloudCoverPercentageSelector);
  const requests = useSelector(requestsSelector);
  const dispatch = useDispatch();

  return (
    <Results
      isFetchingResults={
        !!requests?.[searchSatelliteScenes.typePrefix.split('/')[1]]
      }
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
  );
};

const VisualisationView = ({ visualisations }) => {
  const visualisationId = useSelector(visualisationIdSelector);
  const selectedSceneLayerVisible = useSelector(
    selectedSceneLayerVisibleSelector,
  );
  const dispatch = useDispatch();

  return (
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
  );
};

const Satellites = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const satellites = useSelector(satellitesSelector);
  const scenes = useSelector(scenesSelector);
  const selectedScene = useSelector(selectedSceneSelector);
  const visiblePanel = useSelector(visiblePanelSelector);
  const visualisations = useMemo(
    () =>
      satellites?.find(sat => sat.id === selectedScene?.satellite)
        ?.visualisations,
    [satellites, selectedScene],
  );

  useEffect(() => {
    if (!satellites) {
      dispatch(fetchSatellites());
    }
  }, [satellites, dispatch]);

  useEffect(() => {
    dispatch(setVisiblePanel(Panels.SEARCH));
    return () => {
      dispatch(onSatelliteUnmount());
    };
  }, [dispatch]);

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
          disabled={!selectedScene}
        />
      </Tabs>
      <div className={styles.container}>
        {visiblePanel === Panels.SEARCH && <SearchView />}
        {visiblePanel === Panels.RESULTS && <ResultsView />}
        {visiblePanel === Panels.VISUALISATION && (
          <VisualisationView visualisations={visualisations} />
        )}
      </div>
    </div>
  );
};

export default Satellites;
