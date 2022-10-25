import React from 'react';

import { Button, Link, makeStyles, ThemeProvider } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import { GEOMETRY_TYPES } from './data-layers.constants';
import {
  crossFilterableDataSourcesSelector,
  activeCrossFilteringLayersSelector,
  activeCrossFilterPropertiesSelector,
  isCrossFilteringModeSelector,
  setCrossFilterLayers,
  setCrossFilterSelectedProperties,
  setCrossFilteringCommonGeometry,
} from './data-layers.slice';
import { LayersList } from './layers-list/layers-list.component';
import { groupPropertiesAndSourceIds, getGeometryType } from './utils';

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

  const dataSources = useSelector(crossFilterableDataSourcesSelector);

  const handleDialogSubmit = selectedProperties => {
    const groupedPropertiesAndSourceIds = groupPropertiesAndSourceIds(
      selectedProperties,
      dataSources,
    );

    // Non-duplicated array of source_ids for selected properties
    const sourcesIdsOfSelectedProperties = Object.keys(
      groupedPropertiesAndSourceIds,
    );
    const geometryTypes = dataSources
      .filter(dataSource =>
        sourcesIdsOfSelectedProperties.includes(dataSource.source_id),
      )
      .map(
        source =>
          source.metadata.application.orbis.crossfiltering
            .geometry_types_hierarchy[0],
      );
    const selectedPropertiesCommonGeometry = getGeometryType(
      geometryTypes,
      GEOMETRY_TYPES,
    );
    dispatch(setCrossFilteringCommonGeometry(selectedPropertiesCommonGeometry));
    dispatch(setCrossFilterLayers(sourcesIdsOfSelectedProperties));
    dispatch(setCrossFilterSelectedProperties(groupedPropertiesAndSourceIds));
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
