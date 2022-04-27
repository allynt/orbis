import React, { useCallback } from 'react';

import { styled } from '@astrosat/astrosat-ui';

import DeckGL from '@deck.gl/react';
import ReactMapGl, {
  ScaleControl as ReactMapGlScaleControl,
} from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';

import { useMap } from 'MapContext';

import { NavigationControl } from './controls/navigation-control/navigation-control.component';

const ScaleControl = styled(ReactMapGlScaleControl)({
  position: 'absolute',
  right: '19rem',
  zIndex: 1,
  bottom: '.5em',
});

/**
 * @typedef {{
 *   mapStyle: import('mapbox-gl').Style,
 *   mapRef: import('MapContext').MapContextType['topMapRef'],
 *   deckRef: import('MapContext').MapContextType['topDeckRef'],
 *   controller: boolean,
 *   viewState: import('MapContext').ViewState,
 *   onViewStateChange: (value: import('MapContext').ViewState) => void,
 *   getCursor: (interactiveState: import('@deck.gl/core/lib/deck').InteractiveState) => string,
 *   mapComponents: JSX.Element[],
 *   mapboxApiAccessToken: string,
 *   editableLayer: import('@nebula.gl/layers').EditableGeoJsonLayer
 *   drawAoiLayer: import('@nebula.gl/layers').EditableGeoJsonLayer,
 *   drawSatelliteAoiLayer: import('@nebula.gl/layers').EditableGeoJsonLayer,
 *   transformRequest: function
 * }} TopMapProps
 */

export const TopMap = React.memo(
  /** @param {TopMapProps} props */
  ({
    mapStyle,
    mapRef,
    deckRef,
    controller,
    viewState,
    onViewStateChange,
    getCursor,
    mapComponents,
    mapboxApiAccessToken,
    editableLayer,
    drawAoiLayer,
    drawSatelliteAoiLayer,
    transformRequest,
  }) => {
    const { setViewState } = useMap();

    const handleGeocoderSelect = useCallback(
      newViewState => setViewState(newViewState),
      [setViewState],
    );

    return (
      <ReactMapGl
        key="top"
        ref={mapRef}
        style={{ pointerEvents: 'none' }}
        mapStyle={mapStyle}
        viewState={viewState}
        width="100%"
        height="100%"
        reuseMaps={true}
        preserveDrawingBuffer={true}
        mapboxApiAccessToken={mapboxApiAccessToken}
        transformRequest={transformRequest}
      >
        <DeckGL
          ref={deckRef}
          controller={controller}
          viewState={viewState}
          onViewStateChange={onViewStateChange}
          layers={[drawAoiLayer, drawSatelliteAoiLayer, editableLayer]}
          getCursor={getCursor}
          style={{ pointerEvents: controller ? 'all' : 'none' }}
          glOptions={{
            preserveDrawingBuffer: true,
          }}
        />
        <NavigationControl onViewStateChange={onViewStateChange} />

        <ScaleControl unit="metric" />

        <Geocoder
          mapRef={mapRef}
          mapboxApiAccessToken={mapboxApiAccessToken}
          position="top-right"
          marker={false}
          onViewportChange={handleGeocoderSelect}
        />
        <React.Suspense fallback={<div>Loading...</div>}>
          {mapComponents}
        </React.Suspense>
      </ReactMapGl>
    );
  },
);
TopMap.displayName = 'TopMap';
