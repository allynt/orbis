import React from 'react';

import {
  AmbientLight,
  LightingEffect,
  _SunLight as SunLight,
} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import ReactMapGl from 'react-map-gl';

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
lightingEffect.shadowColor = [0, 0, 0, 0.5];

let BottomMap = ({
  deckRef,
  mapRef,
  controller,
  viewState,
  onViewStateChange,
  layers = [],
  getCursor,
  mapStyle,
  mapboxApiAccessToken,
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
    />
  </DeckGL>
);
BottomMap = React.memo(BottomMap);
export { BottomMap };
