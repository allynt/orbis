import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  setClickedFeatures,
  setHoveredFeatures,
  layersVisibilitySelector,
} from '../orbReducer';

import iconMapping from './pinIconConfig.iconMapping.json';
import iconAtlas from './pinIconConfig.iconAtlas.svg';

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  setViewState,
  orbState,
  onPointClick,
  onGroupClick,
  onPointHover,
  onGroupHover,
  pinColor = 'purple',
}) => {
  const isVisible = layersVisibilitySelector(id)(orbState);

  const handleHover = info => {
    const data = info?.object ? [info.object] : [];

    const defaultHover = () =>
      dispatch(
        setHoveredFeatures({
          source_id: id,
          hoveredFeatures: data,
        }),
      );

    if (info?.object?.properties?.cluster) {
      if (info.object.properties.expansion_zoom >= MAX_ZOOM) {
        if (typeof onGroupHover === 'function') return onGroupHover(data);
        if (onGroupHover === true) return defaultHover();
      }
    } else {
      if (typeof onPointHover === 'function') return onPointHover(data);
      if (onPointHover === true) return defaultHover();
    }
  };

  /**
   * @param {import('typings/orbis').PickedMapFeature} info
   */
  const handleClick = info => {
    const defaultClick = () =>
      dispatch(
        setClickedFeatures({
          source_id: id,
          clickedFeatures: info?.objects,
        }),
      );

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
        if (typeof onGroupClick === 'function') return onGroupClick(info);
        if (onGroupClick === true) return defaultClick();
      }
    } else {
      if (typeof onPointClick === 'function') return onPointClick(info);
      if (onPointClick === true) return defaultClick();
    }
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
