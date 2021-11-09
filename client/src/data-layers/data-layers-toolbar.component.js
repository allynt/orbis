import React, { useState } from 'react';

import {
  LayersIcon,
  makeStyles,
  ResultsIcon,
  Tab,
  Tabs,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import AoiView from './aoi/aoi.component';
import {
  setVisiblePanel,
  startDrawingAoi,
  visiblePanelSelector,
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
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

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
        <Tab
          className={styles.tab}
          icon={<ResultsIcon titleAccess="Draw AOI" />}
          value={Panels.AOI}
        />
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
          <AoiView onDrawAoiClick={onDrawAoiClick} />
        )}
      </div>
    </div>
  );
};

export default DataLayersToolbar;
