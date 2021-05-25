import React from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import {
  Chip,
  CloseIcon,
  Grid,
  makeStyles,
  Tooltip,
} from '@astrosat/astrosat-ui';
import { hoveredFeaturesSelector } from 'map/orbs/layers.slice';

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
 *   onHover: (event: any) => void
 *   feature: import('typings/orbis').PolygonPickedMapFeature
 *   fallbackProperty?: string
 *   isOnlyFeature?: boolean
 * }} props
 */
export const TooltipChip = ({
  onDelete,
  onHover,
  feature,
  fallbackProperty,
  isOnlyFeature,
}) => {
  const hoveredFeatures = useSelector(state =>
    hoveredFeaturesSelector(feature?.layer?.id)(state?.orbs),
  );

  const areaIdentifier =
    get(feature.object.properties, 'area_name') ??
    get(feature.object.properties, fallbackProperty);

  const areaIsHovered = hoveredFeatures?.id === areaIdentifier;

  const styles = useStyles({ isOnlyFeature });

  const ChipElement = (
    <Chip
      tabIndex={-1}
      color={areaIsHovered ? 'primary' : ''}
      classes={{ label: styles.chip }}
      size="small"
      label={areaIdentifier}
      onDelete={onDelete}
      onMouseEnter={() =>
        onHover({
          type: 'pillHover',
          id: feature?.object?.properties?.area_name,
        })
      }
      onMouseLeave={() => onHover(undefined)}
      deleteIcon={
        <CloseIcon
          className={styles.closeIcon}
          titleAccess={`Remove ${areaIdentifier}`}
          role="button"
        />
      }
    />
  );

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
      <Grid item>{ChipElement}</Grid>
    </Tooltip>
  ) : (
    <Grid item>{ChipElement}</Grid>
  );
};
