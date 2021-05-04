import React, { useState } from 'react';

import {
  Button,
  ButtonGroup,
  Collapse,
  Fade,
  Grid,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { SidePanelSection } from 'components';
import {
  removeClickedFeatures,
  setClickedFeatures,
} from 'map/orbs/layers.slice';
import { useAnalysisPanelContext } from '../analysis-panel-context';
import { TooltipChip } from './tooltip-chip.component';

/**
 * @type {(props?: {isOnlyFeature?: boolean}) => Record<"chips" | "button" | "buttonGroup" | "value", string>}
 */
const useStyles = makeStyles(theme => ({
  chips: {
    maxWidth: '20rem',
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
 * @type {import('typings/orbis').AnalysisPanelComponent<
 *   {fallbackProperty?: string, currentSource?: import('typings/orbis').Source},
 *   import('typings/orbis').PolygonPickedMapFeature
 * >}
 * */
export const ClickedFeaturesSummary = ({
  clickedFeatures,
  selectedProperty,
  dispatch,
  fallbackProperty,
}) => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  const { populationTotal, householdTotal } = useAnalysisPanelContext();

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
                    isOnlyFeature={clickedFeatures.length === 1}
                    fallbackProperty={fallbackProperty}
                    onDelete={() =>
                      dispatch(
                        removeClickedFeatures({
                          key: selectedProperty?.source_id,
                          uniquePropertyPath: `object.properties.${clickedFeatures[0].layer?.props?.uniqueIdProperty}`,
                          clickedFeatures: [feature],
                        }),
                      )
                    }
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
              onClick={() =>
                dispatch(
                  setClickedFeatures({
                    key: selectedProperty?.source_id,
                    clickedFeatures: undefined,
                  }),
                )
              }
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
              ): <span className={styles.value}>{populationTotal}</span>
            </Typography>
          </Grid>
        )}
        {!clickedFeatures?.some(f => !f.object.properties.households) && (
          <Grid item xs={12}>
            <Typography>
              Total households:{' '}
              <span className={styles.value}>{householdTotal}</span>
            </Typography>
          </Grid>
        )}
      </Grid>
    </SidePanelSection>
  );
};
