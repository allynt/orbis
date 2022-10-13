import React from 'react';

import { Button, Link, makeStyles, ThemeProvider } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import { clearLayerFeatures } from 'map/orbs/layers.slice';

import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  crossFilterableDataSourcesSelector,
  activeCrossFilteringLayersSelector,
  activeCrossFilterPropertiesSelector,
  isCrossFilteringModeSelector,
  setCrossFilterLayers,
  setCrossFilterSelectedProperties,
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

const FilterLayerView = ({
  sidebarComponents,
  activeCategorisedSources,
  drawingToolsEnabled,
  isVisible,
  toggle,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const isCrossFilteringMode = useSelector(isCrossFilteringModeSelector);
  const selectedLayers = useSelector(activeCrossFilteringLayersSelector);

  const initialSelectedCrossFilterProperties = useSelector(
    activeCrossFilterPropertiesSelector,
  );

  const dataSources = useSelector(crossFilterableDataSourcesSelector);

  const handleDialogSubmit = selectedProperties => {
    const groupedPropertiesAndSourceIds = selectedProperties.reduce(
      (acc, propertyName) => {
        const propertyParentSourceId = dataSources.find(source =>
          source.properties
            .map(property => property.name)
            .includes(propertyName),
        ).source_id;

        return {
          ...acc,
          [propertyParentSourceId]: [
            ...(acc[propertyParentSourceId] ?? []),
            propertyName,
          ],
        };
      },
      {},
    );

    const sourcesIdsOfSelectedProperties = Object.keys(
      groupedPropertiesAndSourceIds,
    );

    const propertiesToBeRemoved = selectedLayers.filter(
      l => !sourcesIdsOfSelectedProperties.includes(l),
    );

    dispatch(setCrossFilterLayers(sourcesIdsOfSelectedProperties));
    dispatch(setCrossFilterSelectedProperties(groupedPropertiesAndSourceIds));

    if (propertiesToBeRemoved.length) {
      // must also remove selected properties
      dispatch(clearLayerFeatures(propertiesToBeRemoved));
    }
    toggle(false);
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
          initialSelectedCrossFilterProperties={Object.values(
            initialSelectedCrossFilterProperties,
          )}
          isCrossFilteringMode={isCrossFilteringMode}
          onSubmit={handleDialogSubmit}
          close={() => toggle(false)}
          open={isVisible}
        />
      </ThemeProvider>
    </div>
  );
};

export default FilterLayerView;
