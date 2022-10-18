import React from 'react';

import { Button, Link, makeStyles, ThemeProvider } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import { clearLayerFeatures } from 'map/orbs/layers.slice';

import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  dataSourcesSelector,
  activeLayersSelector,
  setLayers,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';

const mockSelectedProperty = {
  name: 'People on benefits: total',
  label: 'Number of people claiming benefits',
  description: 'Test Data',
  source: 'DWP (2020)',
  details: 'Test Data',
  aggregation: 'sum',
  aggregates: {
    GB: 7402009,
    England: 6317185,
    Scotland: 670478,
    Wales: 414346,
  },
  min: 0,
  max: 199,
  clip_min: 0,
  clip_max: 199,
  units: 'persons',
  type: 'continuous',
  precision: 0,
  application: {
    orbis: {
      label: 'Number of people claiming benefits',
      display: {
        colormap_type: 'negative_sequential',
        colormap_reversed: false,
        color: 'YlOrRd',
      },
      data_visualisation_components: [
        {
          name: 'NationalDeviationHistogram',
          props: {
            data: [
              {
                x: 50,
                y: 220697,
              },
              {
                x: 151,
                y: 6902,
              },
              {
                x: 252,
                y: 136,
              },
              {
                x: 353,
                y: 18,
              },
              {
                x: 454,
                y: 4,
              },
              {
                x: 555,
                y: 0,
              },
              {
                x: 656,
                y: 1,
              },
              {
                x: 757,
                y: 0,
              },
              {
                x: 858,
                y: 0,
              },
              {
                x: 959,
                y: 1,
              },
            ],
            info: 'The bar chart is a histogram describing the full dataset across Great Britain. The height of each bar indicates the number of areas in GB that have values within the width of the bar on the horizontal axis. The yellow line shows where your selected area (or the average of all selected areas) falls in comparison to the rest of GB.',
          },
        },
      ],
    },
  },
};

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

const DataLayerView = ({
  sidebarComponents,
  activeCategorisedSources,
  drawingToolsEnabled,
  isVisible,
  toggle,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const selectedLayers = useSelector(activeLayersSelector);

  const dataSources = useSelector(dataSourcesSelector);

  const handleDialogSubmit = sources => {
    dispatch(setLayers(mockSelectedProperty));
    // const layersToBeRemoved = selectedLayers.filter(l => !sources.includes(l));

    // dispatch(setLayers(sources));
    // if (layersToBeRemoved.length) {
    //   dispatch(clearLayerFeatures(layersToBeRemoved));
    // }
    // toggle(false);
  };

  return (
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
  );
};

export default DataLayerView;
