import React from 'react';

import { Button, Link, makeStyles, ThemeProvider } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import { setFilterValues } from 'map/orbs/crossfilter-layers.slice';

import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  crossFilterableDataSourcesSelector,
  activeCrossFilteringLayersSelector,
  activeCrossFilterPropertiesSelector,
  isCrossFilteringModeSelector,
  setCrossFilterLayers,
  setCrossFilterSelectedProperties,
  crossFilteringCommonGeometrySelector,
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

  const selectedCrossFilterProperties = useSelector(
    activeCrossFilterPropertiesSelector,
  );

  const commonGeometry = useSelector(crossFilteringCommonGeometrySelector);

  const dataSources = useSelector(crossFilterableDataSourcesSelector);

  // Groups selected properties by their parent source_ids
  // example: { source_id: [propertyMetadata1, propertyMetadata2] }
  const groupPropertiesAndSourceIds = properties =>
    properties.reduce((acc, property) => {
      const propertyParentSourceId = dataSources.find(source =>
        source.properties.find(p => p.label === property.label),
      ).source_id;

      if (!propertyParentSourceId) return acc;
      return {
        ...acc,
        [propertyParentSourceId]: [
          ...(acc[propertyParentSourceId] ?? []),
          property,
        ],
      };
    }, {});

  const handleDialogSubmit = selectedProperties => {
    const groupedPropertiesAndSourceIds =
      groupPropertiesAndSourceIds(selectedProperties);

    // Non-duplicated array of source_ids for selected properties
    const sourcesIdsOfSelectedProperties = Object.keys(
      groupedPropertiesAndSourceIds,
    );

    const crossFilterValues = selectedProperties.reduce((acc, property) => {
      const { min, max } =
        property?.application?.orbis?.crossfiltering[commonGeometry];

      return {
        ...acc,
        [property.name]: [min, max],
      };
    }, {});

    dispatch(setCrossFilterLayers(sourcesIdsOfSelectedProperties));
    dispatch(setCrossFilterSelectedProperties(groupedPropertiesAndSourceIds));
    dispatch(setFilterValues(crossFilterValues));
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
            selectedCrossFilterProperties,
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
