import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';
import {
  popupFeaturesSelector,
  setPopupFeatures,
} from '../slices/mysupplylynk.slice';
import iconMapping from './pinIconConfig.iconMapping.json';
import iconAtlas from './pinIconConfig.iconAtlas.svg';

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  setViewState,
  orbState,
  pinColor = 'purple',
}) => {
  const popupFeatures = popupFeaturesSelector(orbState);

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
    onHover: handleHover,
  };
};

export default configuration;
