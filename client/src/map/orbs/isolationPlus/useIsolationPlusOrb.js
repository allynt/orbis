import React, { useState } from 'react';

import chroma from 'chroma-js';
import { omitBy } from 'lodash';
import { Popup } from 'react-map-gl';
import { useSelector } from 'react-redux';

import FeatureDetail from 'components/feature-detail/feature-detail.component';
import CustomMVTLayer from 'map/deck.gl/custom-layers/custom-mvt-layer';
import { LAYER_IDS } from 'map/map.constants';
import { colorSchemeSelector, propertySelector } from './isolation-plus.slice';
import { RadioPicker } from './radio-picker/radio-picker.component';

export const useIsolationPlusOrb = (data, sources, authToken) => {
  /** @type {[*, React.Dispatch<*>]} */
  const [pickedInfo, setPickedInfo] = useState();

  const ahahSource = sources?.find(
    source => source.source_id === LAYER_IDS.astrosat.isolationPlus.ahah.v0,
  );
  const ahahSelectedProperty = useSelector(state =>
    // @ts-ignore
    propertySelector(state, LAYER_IDS.astrosat.isolationPlus.ahah.v0),
  );

  const colorScheme = useSelector(colorSchemeSelector);
  const colorScale = chroma
    .scale(colorScheme)
    .domain([
      ahahSource?.metadata.properties[ahahSelectedProperty].min,
      ahahSource?.metadata.properties[ahahSelectedProperty].max,
    ]);

  const layers = [
    // @ts-ignore
    new CustomMVTLayer({
      id: LAYER_IDS.astrosat.isolationPlus.ahah.v0,
      data: data[LAYER_IDS.astrosat.isolationPlus.ahah.v0],
      authToken,
      visible: !!ahahSource,
      minZoom: ahahSource?.metadata.minZoom,
      maxZoom: ahahSource?.metadata.maxZoom,
      uniqueIdProperty: ahahSource?.metadata.uniqueIdProperty,
      pickable: true,
      autoHighlight: true,
      onClick: info => setPickedInfo(info),
      filled: true,
      getFillColor: d => [
        // @ts-ignore
        ...colorScale(d.properties[ahahSelectedProperty]).rgb(),
        150,
      ],
      updateTriggers: {
        getFillColor: [ahahSelectedProperty],
      },
    }),
  ];

  const mapComponents = [
    pickedInfo && (
      <Popup
        key="isolationPlusPopup"
        longitude={pickedInfo.lngLat[0]}
        latitude={pickedInfo.lngLat[1]}
        onClose={() => setPickedInfo(undefined)}
        captureScroll
      >
        <FeatureDetail
          features={[
            omitBy(
              pickedInfo.object.properties,
              (_, key) =>
                key !== ahahSelectedProperty &&
                !key.toLowerCase().includes('code'),
            ),
          ]}
          title="Metadata"
        />
      </Popup>
    ),
  ];

  return {
    layers,
    mapComponents,
    sidebarComponents: {
      [LAYER_IDS.astrosat.isolationPlus.ahah.v0]: RadioPicker,
    },
  };
};

useIsolationPlusOrb.id = 'test';
