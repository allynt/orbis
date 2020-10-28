import { FlyToInterpolator } from 'deck.gl';
import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';
import {
  categoryFiltersSelector,
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
} from '../mySupplyLynk/mysupplylynk.slice';
import iconMapping from './mySupplyLynkConfig.iconMapping.json';
import iconAtlas from './mySupplyLynkConfig.iconAtlas.svg';

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  setViewState,
  orbState,
}) => {
  const categoryFilters = categoryFiltersSelector(orbState);
  const popupFeatures = popupFeaturesSelector(orbState);

  const getFeatures = () => {
    const obj = data;

    const hasCategory = feat =>
      feat.properties.Items.some(item =>
        categoryFilters.includes(item.Category),
      );

    let filteredFeatures;
    if (obj) {
      filteredFeatures = obj.features.filter(feat => hasCategory(feat));
    }

    if (filteredFeatures) {
      return {
        type: 'FeatureCollection',
        features: filteredFeatures,
      };
    }
  };

  const handleLayerClick = info => {
    console.log('HANDLE CLICK');
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
      else dispatch(setPopupFeatures(info.objects));
    } else {
      dispatch(setDialogFeatures([info.object.properties]));
      dispatch(setPopupFeatures([]));
      dispatch(toggleDialog());
    }
  };

  const handleHover = info => {
    if (popupFeatures.length > 1) return;
    if (!info?.object?.properties?.cluster) {
      dispatch(
        info.object ? setPopupFeatures([info.object]) : setPopupFeatures([]),
      );
    }
  };

  return {
    id,
    data: categoryFilters?.length && getFeatures(),
    visible: !!activeSources?.find(source => source.source_id === id),
    iconMapping,
    iconAtlas,
    getIcon: 'pin',
    onClick: handleLayerClick,
    onHover: handleHover,
  };
};

export default configuration;
