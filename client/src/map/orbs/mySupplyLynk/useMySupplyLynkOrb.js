import React, { useState, useRef } from 'react';
import { Popup } from 'react-map-gl';

import { FlyToInterpolator } from 'deck.gl';
import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';

import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';

import iconMapping from './iconMapping.json';
import iconAtlas from './iconAtlas.svg';

import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFeatures, featuresSelector } from './mysupplylynk.slice';

import { CATEGORIES } from './mysupplylynk.constants';

import { Dialog } from './dialog/dialog.component';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import { CheckboxFilters } from './checkbox-filters/checkbox-filters.component';
import FeatureDetail from 'components/feature-detail/feature-detail.component';

import { LAYER_IDS, MAX_ZOOM } from 'map/map.constants';

export const useMySupplyLynkOrb = (data, activeSources) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [isVisible, toggle] = useModal(false);

  const selectedFeatures = useSelector(featuresSelector);

  const [clickedObjects, setClickedObjects] = useState([]);
  const [hoveredObjects, setHoveredObjects] = useState([]);
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
    } else {
      setClickedObjects([info.object]);
      toggle();
    }
  };

  const handleHover = info => {
    if (!info?.object?.properties?.cluster) {
      info.object ? setHoveredObjects([info.object]) : setHoveredObjects([]);
    }
  };

  const layers = [
    ...SUPPLYLYNK_LAYER_IDS.map(
      id =>
        new GeoJsonClusteredIconLayer({
          id,
          data: selectedFeatures?.length && getFeatures(),
          visible: true,
          pickable: true,
          iconMapping,
          iconAtlas,
          getIcon: feature => (feature.properties.cluster ? 'cluster' : 'pin'),
          getIconSize: 60,
          getIconColor: [246, 190, 0],
          getTextSize: 32,
          getTextColor: [51, 63, 72],
          clusterRadius: 40,
          maxZoom: MAX_ZOOM,
          onClick: handleLayerClick,
          onHover: handleHover,
        }),
    ),
  ];

  const sidebarComponents = {
    ...SUPPLYLYNK_LAYER_IDS.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: () => (
          <CheckboxFilters
            categories={CATEGORIES}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={features =>
              dispatch(setSelectedFeatures(features))
            }
          />
        ),
      }),
      {},
    ),
  };

  const mapComponents = [
    hoveredObjects.length && (
      <Popup
        longitude={hoveredObjects[0]?.geometry.coordinates[0]}
        latitude={hoveredObjects[0]?.geometry.coordinates[1]}
        onClose={() => setHoveredObjects([])}
        captureScroll
      >
        <FeatureDetail
          title={hoveredObjects[0]?.properties.Name}
          features={[hoveredObjects[0]?.properties]}
        />
      </Popup>
    ),
  ];

  const dialog = [
    clickedObjects.length && (
      <Dialog
        supplier={clickedObjects[0].properties}
        onCloseClick={toggle}
        isVisible={isVisible}
        ref={ref}
      />
    ),
  ];

  return { layers, mapComponents, sidebarComponents, dialog };
};
