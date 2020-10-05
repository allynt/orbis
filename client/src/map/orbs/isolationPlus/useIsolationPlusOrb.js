import React, { useEffect } from 'react';

import chroma from 'chroma-js';
import { omitBy } from 'lodash';
import { Popup } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';

import FeatureDetail from 'components/feature-detail/feature-detail.component';
import { CustomMVTLayer } from 'map/deck.gl/custom-layers/custom-mvt-layer';
import { LAYER_IDS } from 'map/map.constants';
import {
  colorSchemesSelector,
  propertySelector,
  pickedInfoSelector,
  setPickedInfo,
} from './isolation-plus.slice';

const TILE_LAYERS = [
  LAYER_IDS.astrosat.isolationPlus.ageDemographicsCensus.r1v2,
  LAYER_IDS.astrosat.isolationPlus.ageDemographicsONS.r2v1,
  LAYER_IDS.astrosat.isolationPlus.ahah.r2v1,
  LAYER_IDS.astrosat.isolationPlus.airPollution.r2v1,
  LAYER_IDS.astrosat.isolationPlus.broadbandConnectivity.v2,
  LAYER_IDS.astrosat.isolationPlus.childPoverty.v2,
  LAYER_IDS.astrosat.isolationPlus.deprivedHouses.v2,
  LAYER_IDS.astrosat.isolationPlus.greenspace.r2v1,
  LAYER_IDS.astrosat.isolationPlus.healthVulnerability.r2v1,
  LAYER_IDS.astrosat.isolationPlus.generalHousing.r2v1,
  LAYER_IDS.astrosat.isolationPlus.imd.r2v1,
  LAYER_IDS.astrosat.isolationPlus.localFuelPoverty.r1v3,
  LAYER_IDS.astrosat.isolationPlus.mobileConnectivity.v2,
  LAYER_IDS.astrosat.isolationPlus.socialIsolation.r2v1,
];

export const useIsolationPlusOrb = (data, sources, authToken) => {
  const dispatch = useDispatch();
  const pickedInfo = useSelector(pickedInfoSelector);
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
          onClick: info => dispatch(setPickedInfo(info)),
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
        onClose={() => dispatch(setPickedInfo(undefined))}
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
  };
};

useIsolationPlusOrb.id = 'test';
