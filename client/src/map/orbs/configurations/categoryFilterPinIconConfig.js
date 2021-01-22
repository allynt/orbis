import pinIconConfig from './pinIconConfig';

import {
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
  categoryFiltersSelectorFactory,
} from '../slices/mysupplylynk.slice';

import { MAX_ZOOM } from 'map/map.constants';

const categoryFilterPinIconConfig = ({
  id,
  data,
  orbState,
  onClick,
  dispatch,
  ...rest
}) => {
  const categoryFilters = categoryFiltersSelectorFactory(id)(orbState);

  const popupFeatures = popupFeaturesSelector(orbState);

  const getFeatures = () => {
    const obj = data;

    const hasCategory = feat => {
      return feat.properties.Items
        ? feat.properties.Items.some(item =>
            categoryFilters?.includes(item.Category),
          )
        : categoryFilters?.includes(feat?.properties?.Category);
    };

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

  const handleClick = info => {
    if (info?.object?.properties?.cluster) {
      if (info.object.properties.expansion_zoom > MAX_ZOOM)
        dispatch(
          setPopupFeatures({ id: info.layer.props.id, features: info.objects }),
        );
    } else {
      if (onClick !== false) {
        dispatch(setDialogFeatures([info.object.properties]));
        dispatch(setPopupFeatures({ id: undefined, features: [] }));
        dispatch(toggleDialog());
      }
    }
  };

  return pinIconConfig({
    id,
    data: getFeatures(),
    orbState,
    dispatch,
    onClick: handleClick,
    onHover: handleHover,
    ...rest,
  });
};

export default categoryFilterPinIconConfig;
