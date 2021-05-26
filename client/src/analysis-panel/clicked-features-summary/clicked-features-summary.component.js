import { Grid } from '@astrosat/astrosat-ui';
import { SidePanelSection } from 'components';
import {
  removeClickedFeatures,
  setClickedFeatures,
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
