import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import iconMapping from './actionForHelpConfig.iconMapping.json';
import iconAtlas from './actionForHelpConfig.iconAtlas.svg';
import { setPickedObjects } from 'map/orbs/slices/action-for-help.slice';
import { easeInOutCubic } from 'utils/easingFunctions';

const configuration = ({
  id,
  data,
  pinColor,
  orbState,
  activeSources,
  dispatch,
  setViewState,
}) => {
  const layersVisibility = orbState['actionForHelp'].layersVisibility[id];

  console.log('layersVisibility: ', layersVisibility);

  const handleLayerClick = info => {
    if (info.object.properties.cluster) {
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
      else dispatch(setPickedObjects(info.objects));
    } else dispatch(setPickedObjects([info.object]));
  };

  return {
    id,
    iconMapping,
    iconAtlas,
    data,
    visible:
      layersVisibility &&
      !!activeSources?.find(source => source.source_id === id),
    onClick: handleLayerClick,
    getIcon: `pin-${pinColor}`,
    groupIconName: `group-${pinColor}`,
    getIconSize: feature => (feature.properties.Type ? 15 : 60),
  };
};

export default configuration;
