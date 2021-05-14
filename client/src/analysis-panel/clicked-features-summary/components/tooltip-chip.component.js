import React from 'react';
import { get } from 'lodash';
import { bbox, bboxPolygon } from '@turf/turf';
import { WebMercatorViewport } from '@deck.gl/core';

import {
  Chip,
  CloseIcon,
  Grid,
  makeStyles,
  Tooltip,
} from '@astrosat/astrosat-ui';

import { useMap } from 'MapContext';

const MAX_CHARS = 15;

/**
 * @type {(props?: {isOnlyFeature?: boolean}) => Record<"tooltip" | "chip" | "closeIcon", string>}
 */
const useStyles = makeStyles(theme => ({
  chip: {
    fontSize: theme.typography.pxToRem(10),
    maxWidth: props => (!props.isOnlyFeature ? `${MAX_CHARS}ch` : undefined),
  },
  closeIcon: {
    width: theme.typography.pxToRem(10),
  },
  tooltip: {
    top: '-1.5rem',
  },
}));

/**
 * @param {{
 *   onDelete: (event: any) => void
 *   feature: import('typings/orbis').PolygonPickedMapFeature
 *   fallbackProperty?: string
 *   isOnlyFeature?: boolean
 * }} props
 */
export const TooltipChip = ({
  onDelete,
  feature,
  fallbackProperty,
  isOnlyFeature,
}) => {
  const styles = useStyles({ isOnlyFeature });

  const { viewState, setViewState } = useMap();

  const areaIdentifier =
    get(feature.object.properties, 'area_name') ??
    get(feature.object.properties, fallbackProperty);

  const ChipElement = (
    <Chip
      tabIndex={-1}
      classes={{ label: styles.chip }}
      size="small"
      label={areaIdentifier}
      onDelete={onDelete}
      deleteIcon={
        <CloseIcon
          className={styles.closeIcon}
          titleAccess={`Remove ${areaIdentifier}`}
          role="button"
        />
      }
    />
  );

  function tile2long(lon, zoom) {
    return (lon / Math.pow(2, zoom)) * 360 - 180;
  }

  function tile2lat(lat, zoom) {
    var n = Math.PI - (2 * Math.PI * lat) / Math.pow(2, zoom);
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  }

  const zoomToChipLocation = () => {
    const viewport = new WebMercatorViewport({});
    const points = bbox(feature?.object.geometry);

    const minX = points[0],
      maxX = points[2],
      minY = points[1],
      maxY = points[3];

    const bounds = [
      [minX, minY],
      [maxX, maxY],
    ];

    // extent in minX, minY, maxX, maxY order
    // bottom left, bottom right, top left, top right

    const { longitude, latitude, zoom } = viewport.fitBounds(bounds);

    const newViewstate = {
      ...viewState,
      longitude: tile2long(longitude, zoom),
      latitude: tile2lat(latitude, zoom),
      zoom: 6,
    };

    console.log('newViewstate: ', newViewstate);

    return setViewState(newViewstate);
  };

  return areaIdentifier?.length + 2 >= MAX_CHARS && !isOnlyFeature ? (
    <Tooltip
      role="tooltip"
      id={areaIdentifier}
      classes={{
        tooltip: styles.tooltip,
      }}
      arrow
      placement="bottom"
      title={areaIdentifier}
    >
      <Grid item onClick={zoomToChipLocation}>
        {ChipElement}
      </Grid>
    </Tooltip>
  ) : (
    <Grid item onClick={zoomToChipLocation}>
      {ChipElement}
    </Grid>
  );
};
