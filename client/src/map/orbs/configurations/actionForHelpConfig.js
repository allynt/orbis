import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import iconMapping from './actionForHelpConfig.iconMapping.json';
import iconAtlas from './actionForHelpConfig.iconAtlas.svg';
import { setPickedObjects } from 'map/orbs/slices/action-for-help.slice';
import { easeInOutCubic } from 'utils/easingFunctions';

/**
 * @typedef {import('typings/orbis').GeoJsonFeature<{type?: string, Type?: string}>} ActionForHelpFeature
 */

const configuration = ({ id, data, activeSources, dispatch, setViewState }) => {
  /** @param {import('typings/orbis').PickedMapFeature} info */
  const handleLayerClick = info => {
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
      else dispatch(setPickedObjects(info.objects));
    } else dispatch(setPickedObjects([info.object]));
  };

  /** @param {ActionForHelpFeature} feature */
  const getIcon = feature => feature.properties.type || feature.properties.Type;

  /** @param {ActionForHelpFeature} feature */
  const getIconSize = feature => (feature.properties.Type ? 15 : 60);

  return {
    id,
    iconMapping,
    iconAtlas,
    data,
    visible: !!activeSources?.find(source => source.source_id === id),
    onClick: handleLayerClick,
    getIcon,
    getIconSize,
  };
};

export default configuration;
