import React from 'react';

import {
  AmbientLight,
  LightingEffect,
  _SunLight as SunLight,
} from '@deck.gl/core';
// eslint-disable-next-line import/no-named-as-default
import DeckGL from '@deck.gl/react';
import ReactMapGl from 'react-map-gl';

/**
 * @typedef {{
 *  deckRef: import('MapContext').MapContextType['bottomDeckRef'],
 *  mapRef: import('MapContext').MapContextType['bottomMapRef'],
 *  controller: boolean,
 *  viewState: import('MapContext').ViewState,
 *  onViewStateChange: (value: import('MapContext').ViewState) => void,
 *  layers: any[],
 *  getCursor: (interactiveState: import('@deck.gl/core/lib/deck').InteractiveState) => string,
 *  mapStyle: import('mapbox-gl').Style,
 *  mapboxApiAccessToken: string,
 *  transformRequest: function
 * }} BottomMapProps
 */

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 10),
  color: [255, 255, 255],
  intensity: 1.0,
});

const lightingEffect = new LightingEffect({ ambientLight, dirLight });
// @ts-ignore
lightingEffect.shadowColor = [0, 0, 0, 0.5];

export const BottomMap = React.memo(
  /** @param {BottomMapProps} props */
  ({
    deckRef,
    mapRef,
    controller,
    viewState,
    onViewStateChange,
    layers = [],
    getCursor,
    mapStyle,
    mapboxApiAccessToken,
    transformRequest,
  }) => (
    <DeckGL
      ref={deckRef}
      controller={controller}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      layers={layers}
      getCursor={getCursor}
      effects={[lightingEffect]}
      glOptions={{
        preserveDrawingBuffer: true,
      }}
    >
      <ReactMapGl
        key="bottom"
        ref={mapRef}
        mapStyle={mapStyle}
        attributionControl={false}
        viewState={viewState}
        width="100%"
        height="100%"
        reuseMaps={true}
        preserveDrawingBuffer={true}
        mapboxApiAccessToken={mapboxApiAccessToken}
        transformRequest={transformRequest}
      />
    </DeckGL>
  ),
);
BottomMap.displayName = 'BottomMap';
