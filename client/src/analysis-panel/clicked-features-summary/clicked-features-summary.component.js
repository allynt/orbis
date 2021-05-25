import { Grid } from '@astrosat/astrosat-ui';
import { SidePanelSection } from 'components';
import {
  removeClickedFeatures,
  setClickedFeatures,
  setHoveredFeatures,
} from 'map/orbs/layers.slice';
import React from 'react';
import { useAnalysisPanelContext } from '../analysis-panel-context';
import { ClickedFeatureChips, DataValue } from './components';

/**
 * @type {import('typings/orbis').AnalysisPanelComponent<
 *   {fallbackProperty?: string, currentSource?: import('typings/orbis').Source},
 *   import('typings/orbis').PolygonPickedMapFeature
 * >}
 * */
export const ClickedFeaturesSummary = ({
  clickedFeatures,
  hoveredFeatures,
  selectedProperty,
  dispatch,
  fallbackProperty,
}) => {
  const { populationTotal, householdTotal } = useAnalysisPanelContext();

  const handleFeatureHover = feature =>
    dispatch(
      setHoveredFeatures({
        key: selectedProperty?.source_id,
        hoveredFeatures: feature ? [feature] : undefined,
      }),
    );

  return (
    <SidePanelSection title="Selected Areas of Interest" defaultExpanded>
      <Grid container spacing={2}>
        <ClickedFeatureChips
          clickedFeatures={clickedFeatures}
          hoveredFeatures={hoveredFeatures}
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
          onFeatureHover={handleFeatureHover}
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
          <DataValue
            label={`Total population (${clickedFeatures?.[0].object.properties.population_year})`}
            value={populationTotal}
          />
        )}
        {!clickedFeatures?.some(f => !f.object.properties.households) && (
          <DataValue label="Total households" value={householdTotal} />
        )}
      </Grid>
    </SidePanelSection>
  );
};
