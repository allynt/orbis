import React from 'react';

import { Button, Link, makeStyles, ThemeProvider } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import CrossFilteringSliders from 'map/orbs/components/crossFilteringSlider/crossFilteringSlider.component';
import { clearLayerFeatures } from 'map/orbs/layers.slice';

import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  crossFilterableDataSourcesSelector,
  activeCrossFilteringLayersSelector,
  setCrossFilterLayers,
  crossFilterValuesSelector,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';
import testData from './test-data';

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

const FilterLayerView = ({
  sidebarComponents,
  activeCategorisedSources,
  drawingToolsEnabled,
  isVisible,
  toggle,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const selectedLayers = useSelector(activeCrossFilteringLayersSelector);

  const dataSources = useSelector(crossFilterableDataSourcesSelector);

  const crossFilterValues = useSelector(crossFilterValuesSelector);

  const handleDialogSubmit = sources => {
    const layersToBeRemoved = selectedLayers.filter(l => !sources.includes(l));

    dispatch(setCrossFilterLayers(sources));
    if (layersToBeRemoved.length) {
      dispatch(clearLayerFeatures(layersToBeRemoved));
    }
    toggle(false);
  };

  /** @param {array[]} values */
  const handleCrossFiltersChange = values => {
    console.log('values: ', values);
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.disabled]: drawingToolsEnabled,
      })}
    >
      <p>
        You need first to add a data layer in order to get access to all the
        range filters and combine them to find areas with a certain set of
        qualities
      </p>
      <LayersList
        dispatch={dispatch}
        selectedLayers={activeCategorisedSources}
        sidebarComponents={sidebarComponents}
      />

      <CrossFilteringSliders
        data={testData}
        handleCrossFiltersChange={handleCrossFiltersChange}
        crossFilterValues={crossFilterValues}
      />
      <Button
        className={styles.button}
        variant="text"
        size="small"
        onClick={() => toggle(true)}
        startIcon={<AddNewCategoryIcon />}
      >
        <Link className={styles.link} color="textPrimary" component="span">
          Add filterable Layers
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
  );
};

export default FilterLayerView;
