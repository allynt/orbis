import React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

import { FlyToInterpolator } from '@deck.gl/core';
import { getFlyToDuration } from '@math.gl/web-mercator';

import { SidePanelSection } from 'components';
import {
  removeClickedFeatures,
  setClickedFeatures,
} from 'map/orbs/layers.slice';
import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';
import { useAnalysisPanelContext } from '../analysis-panel-context';
import { ClickedFeatureChips, DataValue } from './components';
import { createViewstateForFeature } from './create-viewstate-for-feature/create-viewstate-for-feature';

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
  const { viewState, setViewState, bottomDeckRef } = useMap();

  const handleFeatureClick = feature => {
    const viewport = bottomDeckRef.current.viewports[0];

    const newViewState = createViewstateForFeature({
      feature,
      viewport,
    });

    const { width, height } = viewport;
    const { longitude, latitude, zoom } = viewState;

    return setViewState({
      ...viewState,
      ...newViewState,
      transitionDuration: getFlyToDuration(
        {
          // @ts-ignore
          width,
          height,
          longitude,
          latitude,
          zoom,
        },
        newViewState,
      ),
      transitionEasing: easeInOutCubic,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const handleFeatureDelete = feature =>
    dispatch(
      removeClickedFeatures({
        key: selectedProperty?.source_id,
        uniquePropertyPath: `object.properties.${clickedFeatures[0].layer?.props?.uniqueIdProperty}`,
        clickedFeatures: [feature],
      }),
    );

  const handleDeselectAll = () =>
    dispatch(
      setClickedFeatures({
        key: selectedProperty?.source_id,
        clickedFeatures: undefined,
      }),
    );

  return (
    <SidePanelSection title="Selected Areas of Interest" defaultExpanded>
      <Grid container spacing={2}>
        <ClickedFeatureChips
          clickedFeatures={clickedFeatures}
          fallbackProperty={fallbackProperty}
          onFeatureDelete={handleFeatureDelete}
          onFeatureClick={handleFeatureClick}
          onDeselectAllClick={handleDeselectAll}
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
