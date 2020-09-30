import React, { useState, useRef } from 'react';
import { Popup } from 'react-map-gl';

import { FlyToInterpolator } from 'deck.gl';
import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';

import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';

import iconMapping from './iconMapping.json';
import iconAtlas from './iconAtlas.svg';

import { useSelector } from 'react-redux';
import { featuresSelector } from './mysupplylynk.slice';

import { Dialog } from './dialog/dialog.component';
import { useModal } from '@astrosat/astrosat-ui';

import MySupplyLynkFeatureDetail from './feature-detail/mysupplylynk-feature-detail.component';

import { LAYER_IDS, MAX_ZOOM } from 'map/map.constants';

export const TEXT_COLOR_TRANSPARENT = [0, 0, 0, 0];
export const TEXT_COLOR_VISIBLE = [51, 63, 72];

export const useMySupplyLynkOrb = (data, activeSources) => {
  const ref = useRef(null);
  const [isVisible, toggle] = useModal(false);

  const selectedFeatures = useSelector(featuresSelector);

  const [popupFeatures, setPopupFeatures] = useState([]);
  const [dialogFeatures, setDialogFeatures] = useState([]);
  const { setViewState } = useMap();

  const SUPPLYLYNK_LAYER_IDS = [LAYER_IDS.astrosat.mySupplyLynk.latest];

  const getFeatures = () => {
    const obj = data[LAYER_IDS.astrosat.mySupplyLynk.latest];

    const hasCategory = feat =>
      feat.properties.Items.some(item =>
        selectedFeatures.includes(item.Category),
      );

    let filteredFeatures;
    if (obj) {
      filteredFeatures = obj.features.filter(feat => hasCategory(feat));
    }

    if (filteredFeatures) {
      return {
        type: 'FeatureCollection',
        features: filteredFeatures,
      };
    }
  };

  const handleLayerClick = info => {
    if (info?.object?.properties?.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM)
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom:
            info.object.properties.expansion_zoom >= MAX_ZOOM
              ? MAX_ZOOM
              : info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      else setPopupFeatures(info.objects);
    } else {
      setDialogFeatures([info.object.properties]);
      setPopupFeatures([]);
      toggle();
    }
  };

  const handleHover = info => {
    if (popupFeatures.length > 1) return;
    if (!info?.object?.properties?.cluster) {
      info.object ? setPopupFeatures([info.object]) : setPopupFeatures([]);
    }
  };

  const layers = [
    ...SUPPLYLYNK_LAYER_IDS.map(
      id =>
        // @ts-ignore
        new GeoJsonClusteredIconLayer({
          id,
          data: selectedFeatures?.length && getFeatures(),
          visible: !!activeSources?.find(source => source.source_id === id),
          pickable: true,
          iconMapping,
          iconAtlas,
          getIcon: 'pin',
          onClick: handleLayerClick,
          onHover: handleHover,
        }),
    ),
  ];

  const mapComponents = [
    popupFeatures.length && (
      <Popup
        key="popup"
        longitude={popupFeatures[0]?.geometry.coordinates[0]}
        latitude={popupFeatures[0]?.geometry.coordinates[1]}
        closeButton={popupFeatures.length > 1}
        onClose={() => setPopupFeatures([])}
        closeOnClick={false}
        offsetTop={-37}
        captureClick
        captureScroll
      >
        <MySupplyLynkFeatureDetail
          data={popupFeatures.map(feature => feature.properties)}
          onSupplierClick={supplier => {
            setDialogFeatures([supplier]);
            toggle();
          }}
        />
      </Popup>
    ),
    dialogFeatures.length && (
      <Dialog
        key="dialog"
        supplier={dialogFeatures[0]}
        onCloseClick={toggle}
        isVisible={isVisible}
        ref={ref}
      />
    ),
  ];

  return {
    layers,
    mapComponents,
  };
};
