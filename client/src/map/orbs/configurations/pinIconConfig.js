import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import { layersVisibilitySelector } from '../slices/action-for-help.slice';

import { setClickedFeatures } from '../orbReducer';

import iconMapping from './pinIconConfig.iconMapping.json';
import iconAtlas from './pinIconConfig.iconAtlas.svg';

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  setViewState,
  orbState,
  onClick,
  onHover,
  pinColor = 'purple',
}) => {
  const isVisible = layersVisibilitySelector(id)(orbState);

  /**
   * @param {import('typings/orbis').PickedMapFeature} info
   */
  const handleClick = info => {
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
      else {
        if (typeof onClick === 'function') onClick(info);
        if (onClick === true) {
          dispatch(
            setClickedFeatures({
              source_id: id,
              clickedFeatures: info?.objects,
            }),
          );
        }
      }
    } else {
      if (typeof onClick === 'function') onClick(info);
      if (onClick === true) {
        dispatch(
          setClickedFeatures({
            source_id: id,
            clickedFeatures: [info?.object],
          }),
        );
      }
    }
  };

  const handleHover = info => {
    if (typeof onHover === 'function') onHover(info);
  };

  return {
    id,
    data: data,
    visible:
      isVisible && !!activeSources?.find(source => source.source_id === id),
    iconMapping,
    iconAtlas,
    getIcon: `pin-${pinColor}`,
    groupIconName: `group-${pinColor}`,
    onClick: handleClick,
    onHover: handleHover,
  };
};

export default configuration;
