import React from 'react';
import { get } from 'lodash';
import {
  Chip,
  CloseIcon,
  Grid,
  makeStyles,
  Tooltip,
} from '@astrosat/astrosat-ui';

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
 *   onMouseEnter: () => void
 *   onMouseLeave: () => void
 *   isHovered?: boolean
 *   feature: import('typings/orbis').PolygonPickedMapFeature
 *   fallbackProperty?: string
 *   isOnlyFeature?: boolean
 * }} props
 */
export const TooltipChip = ({
  onDelete,
  onMouseEnter,
  onMouseLeave,
  isHovered,
  feature,
  fallbackProperty,
  isOnlyFeature,
}) => {
  const styles = useStyles({ isOnlyFeature });

  const areaIdentifier =
    get(feature.object.properties, 'area_name') ??
    get(feature.object.properties, fallbackProperty);

  const ChipElement = (
    <Chip
      tabIndex={-1}
      color={isHovered ? 'primary' : ''}
      classes={{ label: styles.chip }}
      size="small"
      label={areaIdentifier}
      onDelete={onDelete}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
