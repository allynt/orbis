import React from 'react';

import {
  Button,
  CircularProgress,
  Link,
  makeStyles,
  ThemeProvider,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from 'api-client';
import { geometryHierarchySelector } from 'app.slice';
import { InfoButtonTooltip } from 'components';
import {
  setFilterValues,
  resetSelectedProperty,
  isViewportLoadedSelector,
} from 'map/orbs/crossfilter-layers.slice';

import { ReactComponent as AddNewCategoryIcon } from './add-more-categories.svg';
import DataLayersDialog from './data-layers-dialog/data-layers-dialog.component';
import {
  groupPropertiesAndSourceIds,
  getGeometryType,
} from './data-layers-utils';
import {
  crossFilterableDataSourcesSelector,
  activeCrossFilteringLayersSelector,
  activeCrossFilterPropertiesSelector,
  isCrossFilteringModeSelector,
  setCrossFilterLayers,
  setCrossFilterSelectedProperties,
  setCrossFilteringCommonGeometry,
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
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    padding: '3rem',
  },
  geometry: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  docLink: {
    padding: '1rem',
  },
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
  const geometryHierarchy = useSelector(geometryHierarchySelector);
  const commonGeometry = useSelector(crossFilteringCommonGeometrySelector);
  const commonGeometryDescription =
    geometryHierarchy[commonGeometry]?.description;
  const isViewportLoaded = useSelector(state =>
    isViewportLoadedSelector(state?.orbs),
  );

  const selectedCrossFilterProperties = useSelector(
    activeCrossFilterPropertiesSelector,
  );

  const dataSources = useSelector(crossFilterableDataSourcesSelector);

  const handleDialogSubmit = selectedProperties => {
    dispatch(resetSelectedProperty());

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
      .map(source => {
        const hierarchy =
          source.metadata.application.orbis.crossfiltering
            .geometry_types_hierarchy;
        return hierarchy[0];
      });

    const selectedPropertiesCommonGeometry = getGeometryType(
      geometryTypes,
      geometryHierarchy,
    );

    const crossFilterValues = selectedProperties.reduce((acc, property) => {
      const { min, max, clip_min, clip_max } =
        property?.application?.orbis?.crossfiltering[
          selectedPropertiesCommonGeometry
        ];

      return {
        ...acc,
        [property.name]: {
          filterValue: [min, max],
          clipValue: [clip_min, clip_max],
        },
      };
    }, {});

    dispatch(setCrossFilteringCommonGeometry(selectedPropertiesCommonGeometry));
    dispatch(
      setFilterValues({
        key: 'crossFilterValues',
        crossFilterValues,
      }),
    );
    dispatch(setCrossFilterSelectedProperties(groupedPropertiesAndSourceIds));
    dispatch(setCrossFilterLayers(sourcesIdsOfSelectedProperties));

    toggle(false);
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.disabled]: drawingToolsEnabled,
      })}
    >
      <p>
        Select datasets to combine filters on up to 4 properties. Datasets which
        are defined in different sets of geometries will be aggregated to a
        common set of geometries to allow cross-filtering.
      </p>

      {commonGeometry ? (
        <div className={styles.geometry}>
          <p>
            Aggregated to Geometry:{' '}
            <strong>{commonGeometry?.replace('_', ' ')}</strong>
          </p>
          <InfoButtonTooltip tooltipContent={commonGeometryDescription} />
        </div>
      ) : null}

      <div className={styles.docLink}>
        <Link
          href={apiClient.documents.userGuideUrl('cross-filtering')}
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more about cross-filtering
        </Link>
      </div>

      {isViewportLoaded && selectedLayers.length > 0 ? (
        <LayersList
          dispatch={dispatch}
          selectedLayers={activeCategorisedSources}
          sidebarComponents={sidebarComponents}
        />
      ) : selectedLayers.length > 0 ? (
        <div className={styles.spinner}>
          <CircularProgress size={22} color="inherit" />
        </div>
      ) : null}

      <Button
        className={styles.button}
        variant="text"
        size="small"
        onClick={() => toggle(true)}
        startIcon={<AddNewCategoryIcon />}
      >
        <Link className={styles.link} color="textPrimary" component="span">
          Add Filterable Layers
        </Link>
      </Button>
      <ThemeProvider theme="light">
        <DataLayersDialog
          sources={dataSources}
          initialSelectedSources={selectedLayers}
          initialSelectedCrossFilterProperties={Object.values(
            selectedCrossFilterProperties,
          ).flat()}
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
