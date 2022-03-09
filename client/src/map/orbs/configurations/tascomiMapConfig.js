import { FlyToInterpolator } from '@deck.gl/core';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  setClickedFeatures,
  dataSelector,
} from '../layers.slice';

const PIN_COLOR = [255, 254, 25, 255];

/**
 * @typedef {import('typings').GeoJsonFeature<{type?: string, Type?: string}>} ActionForHelpFeature
 */

const configuration = ({ id, dispatch, setViewState, orbState }) => {
  const data = dataSelector(id)(orbState);

  /** @param {import('typings').PickedMapFeature} info */
  const onClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM)
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom: info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      else
        dispatch(
          setClickedFeatures({ key: id, clickedFeatures: info.objects }),
        );
    } else
      dispatch(setClickedFeatures({ key: id, clickedFeatures: [info.object] }));
  };

  const getPinColor = feature => PIN_COLOR;

  return {
    id,
    data,
    visible: true,
    onClick: onClick,
    pointType: 'icon',
    getPinColor,
  };
};

export default configuration;
