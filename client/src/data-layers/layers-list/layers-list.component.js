import * as React from 'react';

import { Button, styled, Typography, alpha } from '@astrosat/astrosat-ui';

import { FlyToInterpolator } from '@deck.gl/core';
import { fitBounds, getFlyToDuration } from '@math.gl/web-mercator';
import { bboxPolygon } from '@turf/turf';

import { SidePanelSection } from 'components';
import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';

const CategoryHeader = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  backgroundColor: alpha(theme.palette.common.white, 0.17),
  padding: '0.75rem 1rem',
}));

const ButtonBox = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

const ZoomButton = styled(Button)(() => ({
  margin: '0 0 1rem 0',
}));

const createViewstateForSelectedLayer = ({
  selectedLayer,
  viewport,
  padding = 50,
}) => {
  if (!selectedLayer || !viewport) return;

  const { width, height } = viewport;
  const feature = bboxPolygon(selectedLayer.metadata.bounds);

  const [minX, minY, maxX, maxY] = feature.bbox;

  const bounds = [
    [minX, minY],
    [maxX, maxY],
  ];

  const { longitude, latitude, zoom } = fitBounds({
    bounds,
    width,
    height,
    padding,
  });

  return {
    longitude,
    latitude,
    zoom,
  };
};

const zoomToArea = (viewport, viewState, setViewState, selectedLayer) => {
  const newViewState = createViewstateForSelectedLayer({
    selectedLayer,
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

/**
 * @param {{
 *   dispatch: import('redux').Dispatch
 *   selectedLayers: import('typings').CategorisedSources
 *   sidebarComponents: {[key: string]: React.LazyExoticComponent<React.ComponentType<any>>}
 * }} props
 */
export const LayersList = ({ dispatch, selectedLayers, sidebarComponents }) => {
  const { viewState, setViewState, bottomDeckRef } = useMap();

  const onClick = selectedLayer =>
    zoomToArea(
      bottomDeckRef.current.deck,
      viewState,
      setViewState,
      selectedLayer,
    );

  return (
    <>
      {selectedLayers?.map(selectedLayer => {
        if (selectedLayer.category) {
          return (
            <React.Fragment
              key={`${selectedLayer.category}-${selectedLayer.sources[0].source_id}`}
            >
              <CategoryHeader>{selectedLayer.category}</CategoryHeader>
              <LayersList
                dispatch={dispatch}
                sidebarComponents={sidebarComponents}
                selectedLayers={selectedLayer.sources}
              />
            </React.Fragment>
          );
        }

        const Component = sidebarComponents?.[selectedLayer.source_id];

        return (
          <SidePanelSection
            key={selectedLayer.source_id}
            title={selectedLayer.metadata.label}
          >
            {Component && (
              <React.Suspense fallback={<div>Loading...</div>}>
                {selectedLayer.metadata.bounds ? (
                  <ButtonBox>
                    <ZoomButton
                      size="small"
                      onClick={() => onClick(selectedLayer)}
                    >
                      Zoom to Area
                    </ZoomButton>
                  </ButtonBox>
                ) : null}
                {typeof Component === 'function' ? (
                  <Component
                    selectedLayer={selectedLayer}
                    dispatch={dispatch}
                  />
                ) : (
                  Component
                )}
              </React.Suspense>
            )}
          </SidePanelSection>
        );
      })}
    </>
  );
};
