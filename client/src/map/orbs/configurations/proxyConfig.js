import { FlyToInterpolator } from '@deck.gl/core';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import { setClickedFeatures } from '../layers.slice';
import {
  proxyResultsSelector,
  selectedResultSelector,
  setSelectedResult,
  visibilitySelector,
} from '../slices/crowdless.slice';

// import iconAtlas from './crowdlessConfig.iconAtlas.svg';
// import iconMapping from './crowdlessConfig.iconMapping.json';

import iconAtlas from './actionForHelpConfig.iconAtlas.svg';
import iconMapping from './actionForHelpConfig.iconMapping.json';

const configuration = ({ id, orbState, dispatch, setViewState }) => {
  const results = proxyResultsSelector(orbState);
  const visible = visibilitySelector(orbState);
  const selectedResult = selectedResultSelector(orbState);

  /** @param {CrowdlessFeature} feature */
  const getPosition = feature => feature.geometry.coordinates;

  /** @param {CrowdlessFeature} feature */
  const getIcon = feature => 'group';

  /** @param {CrowdlessFeature} feature */
  const getSize = feature => 60;

  /** @param {{object: CrowdlessFeature}} pickedInfo */
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
