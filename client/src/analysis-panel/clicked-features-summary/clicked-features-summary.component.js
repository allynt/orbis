import { Grid, Typography } from '@astrosat/astrosat-ui';
import { SidePanelSection } from 'components';
import {
  removeClickedFeatures,
  setClickedFeatures,
} from 'map/orbs/layers.slice';
import React from 'react';
import { useAnalysisPanelContext } from '../analysis-panel-context';
import { ClickedFeatureChips } from './clicked-feature-chips.component';
import { LightText } from './light-text.component';

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
  const { populationTotal, householdTotal } = useAnalysisPanelContext();

  return (
    <SidePanelSection title="Selected Areas of Interest" defaultExpanded>
      <Grid container spacing={2}>
        <ClickedFeatureChips
          clickedFeatures={clickedFeatures}
          fallbackProperty={fallbackProperty}
          onFeatureDelete={feature =>
            dispatch(
              removeClickedFeatures({
                key: selectedProperty?.source_id,
                uniquePropertyPath: `object.properties.${clickedFeatures[0].layer?.props?.uniqueIdProperty}`,
                clickedFeatures: [feature],
              }),
            )
          }
          onDeselectAllClick={() =>
            dispatch(
              setClickedFeatures({
                key: selectedProperty?.source_id,
                clickedFeatures: undefined,
              }),
            )
          }
        />
        {!clickedFeatures?.some(f => !f.object.properties.population) && (
          <Grid item xs={12}>
            <Typography>
              Total population (
              {clickedFeatures?.[0].object.properties.population_year}
              ): <LightText>{populationTotal}</LightText>
            </Typography>
          </Grid>
        )}
        {!clickedFeatures?.some(f => !f.object.properties.households) && (
          <Grid item xs={12}>
            <Typography>
              Total households: <LightText>{householdTotal}</LightText>
            </Typography>
          </Grid>
        )}
      </Grid>
    </SidePanelSection>
  );
};
