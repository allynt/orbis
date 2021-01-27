import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  setPopupFeatures,
  layersVisibilitySelector,
  popupFeaturesSelector,
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
  onHover,
  pinColor = 'purple',
}) => {
  const isVisible = layersVisibilitySelector(id)(orbState);
  const popupFeatures = popupFeaturesSelector(id)(orbState);

  const handleHover = info => {
    if (typeof onHover === 'function') onHover(info);
    if (onHover === true) {
      if (!info?.object?.properties?.cluster) {
        const data = info.object ? [info.object] : [];
        dispatch(
          setPopupFeatures({
            source_id: info.layer.props.id,
            popupFeatures: data,
          }),
        );
      }
    }
  };

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
        if (typeof onGroupClick === 'function') onGroupClick(info);
        if (onGroupClick === true) {
          dispatch(
            setPopupFeatures({
              source_id: id,
              popupFeatures: info?.objects,
            }),
          );
        }
      }
    } else {
      if (typeof onPointClick === 'function') onPointClick(info);
      if (onPointClick === true) {
        dispatch(
          setPopupFeatures({
            source_id: id,
            popupFeatures: [info?.object],
          }),
        );
      }
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
