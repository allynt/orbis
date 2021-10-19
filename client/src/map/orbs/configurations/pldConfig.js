import { FlyToInterpolator } from '@deck.gl/core';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import { setClickedFeatures, dataSelector } from '../layers.slice';
import iconAtlas from './pldConfig.iconAtlas.svg';
import iconMapping from './pldConfig.iconMapping.json';

const configuration = ({ id, orbState, dispatch, setViewState }) => {
  const data = dataSelector(id)(orbState);

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
    data,
    pointType: 'icon',
    iconAtlas,
    iconMapping,
    getIconSize: 60,
    pickable: true,
    onClick,
  };
};

export default configuration;
