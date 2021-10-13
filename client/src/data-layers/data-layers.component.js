import React, { useState } from 'react';

import { Button, Link, makeStyles, ThemeProvider } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import { removeAllLayerFeatures } from 'map/orbs/layers.slice';

import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  dataSourcesSelector,
  activeCategorisedSourcesSelector,
  activeLayersSelector,
  setLayers,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';

const useStyles = makeStyles(theme => ({
  disablingElement: {
    transition: theme.transitions.create(['filter', 'opacity']),
    '&$disabled': {
      filter: 'grayscale(100%)',
      opacity: 0.8,
      cursor: 'not-allowed',
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    '&$disabled': {
      pointerEvents: 'none',
    },
  },
  link: {
    '&:hover': {
      borderBottomColor: theme.palette.primary.main,
    },
  },
  button: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    margin: '0 auto',
  },
  disabled: {},
}));

/**
 * @param {{
 *   sidebarComponents: Record<string, JSX.Element | JSX.Element[]>
 *   drawingToolsEnabled?: import('drawing-tools/types').DrawingToolsProps['drawingToolsEnabled']
 * }} props
 */
const DataLayers = ({ sidebarComponents, drawingToolsEnabled }) => {
  const styles = useStyles();
  const [isVisible, toggle] = useState(false);

  const dispatch = useDispatch();
  const activeCategorisedSources = useSelector(
    activeCategorisedSourcesSelector(1, true),
  );
  const selectedLayers = useSelector(activeLayersSelector);

  const dataSources = useSelector(dataSourcesSelector);

  const handleDialogSubmit = sources => {
    const layersToBeRemoved = selectedLayers.filter(l => !sources.includes(l));

    dispatch(setLayers(sources));
    dispatch(removeAllLayerFeatures(layersToBeRemoved));
    toggle(false);
  };

  return (
    <div
      className={clsx(styles.disablingElement, {
        [styles.disabled]: drawingToolsEnabled,
      })}
    >
      <div
        className={clsx(styles.wrapper, {
          [styles.disabled]: drawingToolsEnabled,
        })}
      >
        <LayersList
          dispatch={dispatch}
          selectedLayers={activeCategorisedSources}
          sidebarComponents={sidebarComponents}
        />
        <Button
          className={styles.button}
          variant="text"
          size="small"
          onClick={() => toggle(true)}
          startIcon={<AddNewCategoryIcon />}
        >
          <Link className={styles.link} color="textPrimary" component="span">
            Add/Remove Orbs and Data Layers
          </Link>
        </Button>
        <ThemeProvider theme="light">
          <DataLayersDialog
            sources={dataSources}
            initialSelectedSources={selectedLayers}
            onSubmit={handleDialogSubmit}
            close={() => toggle(false)}
            open={isVisible}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
