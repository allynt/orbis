import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
} from '../slices/mysupplylynk.slice';

import { layersVisibilitySelector } from '../slices/action-for-help.slice';

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
  const popupFeatures = popupFeaturesSelector(orbState);

  // must only apply to AFH slice
  // const isVisible = layersVisibilitySelector(id)();

  const handleLayerClick = info => {
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
      else
        dispatch(
          setPopupFeatures({ id: info.layer.props.id, features: info.objects }),
        );
    } else {
      if (onClick !== 'false') {
        dispatch(setDialogFeatures([info.object.properties]));
        dispatch(setPopupFeatures({ id: undefined, features: [] }));
        dispatch(toggleDialog());
      }
    }
  };

  const handleHover = info => {
    if (popupFeatures?.features?.length > 1) return;
    if (!info?.object?.properties?.cluster) {
      dispatch(
        info.object
          ? setPopupFeatures({
              id: info.layer.props.id,
              features: [info.object],
            })
          : setPopupFeatures({ id: undefined, features: [] }),
      );
    }
  };

  return {
    id,
    data: data,
    visible: !!activeSources?.find(source => source.source_id === id),
    iconMapping,
    iconAtlas,
    getIcon: `pin-${pinColor}`,
    groupIconName: `group-${pinColor}`,
    onClick: handleLayerClick,
    onHover: onHover !== false && handleHover,
  };
};

export default configuration;
