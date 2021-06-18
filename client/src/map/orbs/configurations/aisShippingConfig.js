import { FlyToInterpolator } from '@deck.gl/core';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import { setClickedFeatures } from '../layers.slice';
import {
  resultsSelector,
  selectedResultSelector,
  visibilitySelector,
} from '../slices/ais-shipping.slice';
import iconAtlas from './aisShippingConfig.iconAtlas.svg';
import iconMapping from './aisShippingConfig.iconMapping.json';

const configuration = ({ id, orbState, dispatch, setViewState }) => {
  const results = resultsSelector(orbState);
  const visible = visibilitySelector(orbState);
  const selectedResult = selectedResultSelector(orbState);

  const getPosition = feature => feature.geometry.coordinates;

  const getIcon = feature => 'group';

  const getSize = feature => 60;

  const onClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM) {
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom: info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } else {
      return dispatch(
        setClickedFeatures({ key: id, clickedFeatures: [info.object] }),
      );
    }
  };

  return {
    id,
    visible,
    data: results?.features,
    getPosition,
    iconAtlas,
    iconMapping,
    getIcon,
    getSize,
    pickable: true,
    onClick,
    updateTriggers: {
      getIcon: [selectedResult],
      getSize: [selectedResult],
    },
  };
};

export default configuration;
