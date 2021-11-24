import React, { useState } from 'react';

import {
  LayersIcon,
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
  activeCategorisedSources,
  drawingToolsEnabled,
  aoiDrawMode,
  setAoiDrawMode,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const hasAoiFeatureAccess = useOrbFeatureAccess('aoi');

  const visiblePanel = useSelector(visiblePanelSelector);

  const [isVisible, toggle] = useState(false);

  const onDrawAoiClick = () => dispatch(startDrawingAoi());

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
      </Tabs>

      <div className={styles.container}>
        {visiblePanel === Panels.DATA_LAYERS && (
          <DataLayerView
            sidebarComponents={sidebarComponents}
            activeCategorisedSources={activeCategorisedSources}
            drawingToolsEnabled={drawingToolsEnabled}
            isVisible={isVisible}
            toggle={toggle}
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
            editAoi={aoi => dispatch(updateAoi(aoi))}
            deleteAoi={aoi => dispatch(deleteAoi(aoi))}
          />
        )}
      </div>
    </div>
  );
};

export default DataLayersToolbar;
