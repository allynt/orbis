import {
  Button,
  ButtonGroup,
  Chip,
  CloseIcon,
  Collapse,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
  Fade,
} from '@astrosat/astrosat-ui';
import { SidePanelSection } from 'components';
import { sumBy } from 'lodash';
import { removeClickedFeatures } from 'map/orbs/slices/isolation-plus.slice';
import React, { useState } from 'react';

const MAX_CHARS = 15;

const useStyles = makeStyles(theme => ({
  chips: {
    maxWidth: '20rem',
  },
  chip: {
    fontSize: theme.typography.pxToRem(10),
    maxWidth: `${MAX_CHARS}ch`,
  },
  closeIcon: {
    width: theme.typography.pxToRem(10),
  },
  tooltip: {
    top: '-1.5rem',
  },
  buttonGroup: {
    width: '100%',
  },
  button: {
    width: '100%',
    padding: theme.spacing(1),
  },
  value: {
    fontWeight: theme.typography.fontWeightLight,
  },
}));

/**
 * @param {{
 *   onDelete: (event: any) => void
 *   feature: import('typings/orbis').PolygonPickedMapFeature
 * }} props
 */
const TooltipChip = ({ onDelete, feature }) => {
  const styles = useStyles();

  const { index, area_name } = feature.object.properties;
  const areaIdentifier = area_name || index;

  const ChipElement = (
    <Chip
      tabIndex={-1}
      classes={{ label: styles.chip }}
      size="small"
      key={index}
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

  return areaIdentifier?.length + 2 >= MAX_CHARS ? (
    <Tooltip
      role="tooltip"
      id={areaIdentifier}
      classes={{
        tooltip: styles.tooltip,
      }}
      arrow
      placement="bottom"
      title={area_name}
    >
      <Grid item>{ChipElement}</Grid>
    </Tooltip>
  ) : (
    <Grid item>{ChipElement}</Grid>
  );
};

/**
 * @type {import('typings/orbis').AnalysisPanelComponent<
 *   {},
 *   import('typings/orbis').PolygonPickedMapFeature
 * >}
 * */
export const ClickedFeaturesSummary = ({ clickedFeatures, dispatch }) => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  return (
    <SidePanelSection title="Selected Areas of Interest" defaultExpanded>
      <Grid container spacing={2} className={styles.chips}>
        <Grid item xs={12}>
          <Collapse in={open} collapsedHeight="1.6rem">
            <Grid container spacing={1}>
              {clickedFeatures?.map(feature => (
                <Fade in key={feature.index}>
                  <TooltipChip
                    feature={feature}
                    onDelete={() => dispatch(removeClickedFeatures([feature]))}
                  />
                </Fade>
              ))}
            </Grid>
          </Collapse>
        </Grid>
        <Grid item xs container justify="center">
          <ButtonGroup className={styles.buttonGroup} size="small">
            <Button
              className={styles.button}
              onClick={() => dispatch(removeClickedFeatures(clickedFeatures))}
            >
              Deselect All
            </Button>
            <Button
              className={styles.button}
              color="secondary"
              onClick={() => setOpen(o => !o)}
            >
              {open ? 'Hide' : 'Show'} All
            </Button>
          </ButtonGroup>
        </Grid>
        {!clickedFeatures?.some(f => !f.object.properties.population) && (
          <Grid item xs={12}>
            <Typography>
              Total population (
              {clickedFeatures?.[0].object.properties.population_year}
              ):{' '}
              <span className={styles.value}>
                {sumBy(
                  clickedFeatures,
                  'object.properties.population',
                )?.toLocaleString()}
              </span>
            </Typography>
          </Grid>
        )}
        {!clickedFeatures?.some(f => !f.object.properties.households) && (
          <Grid item xs={12}>
            <Typography>
              Total households:{' '}
              <span className={styles.value}>
                {sumBy(
                  clickedFeatures,
                  'object.properties.households',
                )?.toLocaleString()}
              </span>
            </Typography>
          </Grid>
        )}
      </Grid>
    </SidePanelSection>
  );
};
