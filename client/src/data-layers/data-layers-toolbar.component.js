import React, { useEffect, useState } from 'react';

import {
  LayersIcon,
  FilterIcon,
  makeStyles,
  AoiIcon,
  Tab,
  Tabs,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { useOrbFeatureAccess } from 'hooks/useOrbFeatureAccess';

import AoiView from './aoi/aoi.component';
import {
  setVisiblePanel,
  startDrawingAoi,
  visiblePanelSelector,
  saveAoi,
  fetchAois,
  selectAoi,
  updateAoi,
  deleteAoi,
} from './aoi/aoi.slice';
import DataLayerView from './data-layer-view.component';
import { Panels } from './data-layers.constants';
import {
  activeCategorisedSourcesSelector,
  activeCrossFilteringCategorisedSourcesSelector,
  setIsCrossFilteringMode,
} from './data-layers.slice';
import FilterLayerView from './filter-layer-view.component';

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
  button: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: '0 auto',
  },
  disabled: {},
}));

const DataLayersToolbar = ({
  sidebarComponents,
  drawingToolsEnabled,
  aoiDrawMode,
  setAoiDrawMode,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const hasAoiFeatureAccess = useOrbFeatureAccess('aoi');

  const activeCategorisedSources = useSelector(
    activeCategorisedSourcesSelector(1, true),
  );
  const activeCrossFilteringCategorisedSources = useSelector(
    activeCrossFilteringCategorisedSourcesSelector(1, true),
  );

  const visiblePanel = useSelector(visiblePanelSelector);

  const [isDataLayerDialogVisible, toggleDataLayerDialog] = useState(false);
  const [isCrossFilteringDialogVisible, toggleCrossFilteringDialog] =
    useState(false);

  const onDrawAoiClick = () => dispatch(startDrawingAoi());

  useEffect(() => {
    visiblePanel === Panels.FILTERING
      ? dispatch(setIsCrossFilteringMode(true))
      : dispatch(setIsCrossFilteringMode(false));
  }, [dispatch, visiblePanel]);

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
          icon={<LayersIcon titleAccess="Data Layers" />}
          value={Panels.DATA_LAYERS}
        />
        {hasAoiFeatureAccess && (
          <Tab
            className={styles.tab}
            icon={<AoiIcon titleAccess="Draw AOI" />}
            value={Panels.AOI}
          />
        )}
        <Tab
          className={styles.tab}
          icon={<FilterIcon titleAccess="Cross-filtering" />}
          value={Panels.FILTERING}
        />
      </Tabs>

      <div className={styles.container}>
        {visiblePanel === Panels.DATA_LAYERS && (
          <DataLayerView
            sidebarComponents={sidebarComponents}
            activeCategorisedSources={activeCategorisedSources}
            drawingToolsEnabled={drawingToolsEnabled}
            isVisible={isDataLayerDialogVisible}
            toggle={toggleDataLayerDialog}
          />
        )}
        {visiblePanel === Panels.AOI && (
          <AoiView
            onDrawAoiClick={onDrawAoiClick}
            onSubmit={form => dispatch(saveAoi(form))}
            aoiDrawMode={aoiDrawMode}
            setAoiDrawMode={setAoiDrawMode}
            fetchAois={() => dispatch(fetchAois())}
            selectAoi={aoi => dispatch(selectAoi(aoi))}
            editAoiDetails={aoi => dispatch(updateAoi(aoi))}
            deleteAoi={aoi => dispatch(deleteAoi(aoi))}
          />
        )}
        {visiblePanel === Panels.FILTERING && (
          <FilterLayerView
            sidebarComponents={sidebarComponents}
            activeCategorisedSources={activeCrossFilteringCategorisedSources}
            drawingToolsEnabled={drawingToolsEnabled}
            isVisible={isCrossFilteringDialogVisible}
            toggle={toggleCrossFilteringDialog}
          />
        )}
      </div>
    </div>
  );
};

export default DataLayersToolbar;
