import { FlyToInterpolator } from 'deck.gl';
import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';
import { LAYER_IDS, MAX_ZOOM } from 'map/map.constants';
import { useMap } from 'MapContext';
import { useDispatch, useSelector } from 'react-redux';
import { easeInOutCubic } from 'utils/easingFunctions';
import iconAtlas from './iconAtlas.svg';
import iconMapping from './iconMapping.json';
import {
  categoryFiltersSelector,
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
} from './mysupplylynk.slice';

export const useMySupplyLynkOrb = (data, activeSources) => {
  const dispatch = useDispatch();
  const categoryFilters = useSelector(categoryFiltersSelector);
  const popupFeatures = useSelector(popupFeaturesSelector);
  const { setViewState } = useMap();

  const getFeatures = () => {
    const obj = data[LAYER_IDS.astrosat.mySupplyLynk.latest];

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

  const layers = [
    new GeoJsonClusteredIconLayer({
      id: LAYER_IDS.astrosat.mySupplyLynk.latest,
      data: categoryFilters?.length && getFeatures(),
      visible: !!activeSources?.find(
        source => source.source_id === LAYER_IDS.astrosat.mySupplyLynk.latest,
      ),
      iconMapping,
      iconAtlas,
      getIcon: 'pin',
      onClick: handleLayerClick,
      onHover: handleHover,
    }),
  ];

  return {
    layers,
  };
};
