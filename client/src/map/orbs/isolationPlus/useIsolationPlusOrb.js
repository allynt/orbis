import React, { useState, useEffect } from 'react';

import chroma from 'chroma-js';
import { omitBy } from 'lodash';
import { Popup } from 'react-map-gl';
import { useSelector } from 'react-redux';

import FeatureDetail from 'components/feature-detail/feature-detail.component';
import CustomMVTLayer from 'map/deck.gl/custom-layers/custom-mvt-layer';
import { LAYER_IDS } from 'map/map.constants';
import { colorSchemesSelector, propertySelector } from './isolation-plus.slice';
import { RadioPicker } from './radio-picker/radio-picker.component';

const TILE_LAYERS = [
  LAYER_IDS.astrosat.isolationPlus.ageDemographics.v1,
  LAYER_IDS.astrosat.isolationPlus.ahah.v1,
  LAYER_IDS.astrosat.isolationPlus.broadbandConnectivity.v1,
  LAYER_IDS.astrosat.isolationPlus.childPoverty.v1,
  LAYER_IDS.astrosat.isolationPlus.deprivedHouses.v1,
  LAYER_IDS.astrosat.isolationPlus.imdIncome.v1,
  LAYER_IDS.astrosat.isolationPlus.localFuelPoverty.v1,
  LAYER_IDS.astrosat.isolationPlus.mobileConnectivity.v1,
];

export const useIsolationPlusOrb = (data, sources, authToken) => {
  /** @type {[*, React.Dispatch<*>]} */
  const [pickedInfo, setPickedInfo] = useState();
  const selectedProperty = useSelector(propertySelector);
  const colorSchemes = useSelector(colorSchemesSelector);

  useEffect(() => {
    if (selectedProperty && pickedInfo) {
      if (pickedInfo.layer.id !== selectedProperty.source_id)
        setPickedInfo(undefined);
    }
  }, [selectedProperty, pickedInfo]);

  const layers = [
    ...TILE_LAYERS.map(layerId => {
      const source = sources?.find(source => source.source_id === layerId);
      if (source) {
        const colorScale = chroma
          .scale(colorSchemes?.[layerId])
          .domain([selectedProperty?.min, selectedProperty?.max]);
        // @ts-ignore
        return new CustomMVTLayer({
          id: layerId,
          data: data[layerId],
          authToken,
          visible: !!source && selectedProperty.source_id === layerId,
          minZoom: source.metadata.minZoom,
          maxZoom: source.metadata.maxZoom,
          uniqueIdProperty: source.metadata.uniqueIdProperty,
          pickable: true,
          autoHighlight: true,
          onClick: info => setPickedInfo(info),
          filled: true,
          getFillColor: d => [
            // @ts-ignore
            ...colorScale(d.properties[selectedProperty.name]).rgb(),
            150,
          ],
          updateTriggers: {
            getFillColor: [selectedProperty],
          },
        });
      }
      return undefined;
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
                key !== selectedProperty.name &&
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
      ...TILE_LAYERS.reduce((acc, cur) => ({ ...acc, [cur]: RadioPicker }), {}),
    },
    mapboxLayers: TILE_LAYERS,
  };
};

useIsolationPlusOrb.id = 'test';
