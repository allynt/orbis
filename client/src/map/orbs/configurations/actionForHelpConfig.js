import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import iconMapping from './actionForHelpConfig.iconMapping.json';
import iconAtlas from './actionForHelpConfig.iconAtlas.svg';
import { easeInOutCubic } from 'utils/easingFunctions';
import { setClickedFeatures } from '../orbReducer';

const configuration = ({ id, data, activeSources, dispatch, setViewState }) => {
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
      else
        dispatch(
          setClickedFeatures({ source_id: id, clickedFeatures: info.objects }),
        );
    } else
      dispatch(
        setClickedFeatures({ source_id: id, clickedFeatures: [info.object] }),
      );
  };

  return {
    id,
    iconMapping,
    iconAtlas,
    data,
    visible: !!activeSources?.find(source => source.source_id === id),
    onClick: handleLayerClick,
    getIcon: feature => feature.properties.type || feature.properties.Type,
    getIconSize: feature => (feature.properties.Type ? 15 : 60),
  };
};

export default configuration;
