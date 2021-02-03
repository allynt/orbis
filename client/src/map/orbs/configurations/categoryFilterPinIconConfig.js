import pinIconConfig from './pinIconConfig';

import {
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
  categoryFiltersSelectorFactory,
} from '../slices/mysupplylynk.slice';

/**
 * @typedef {import('typings/orbis').GeoJsonFeature} GeoJsonFeature
 */

const categoryFilterPinIconConfig = ({
  id,
  data,
  orbState,
  onPointClick,
  onGroupClick,
  onPointHover,
  onGroupHover,
  dispatch,
  ...rest
}) => {
  const categoryFilters = categoryFiltersSelectorFactory(id)(orbState);

  const popupFeatures = popupFeaturesSelector(orbState);

  const hasCategory = feat => {
    return feat.properties.Items
      ? feat.properties.Items.some(item =>
          categoryFilters?.includes(item.Category),
        )
      : categoryFilters?.includes(feat?.properties?.Category);
  };

  const getFeatures = () => {
    const obj = data;

    let filteredFeatures;
    if (obj) {
      filteredFeatures = obj.features.filter(hasCategory);
    }

    if (filteredFeatures) {
      return {
        type: 'FeatureCollection',
        features: filteredFeatures,
      };
    }
  };

  /**
   * @param {GeoJsonFeature[]} data
   */
  const handleHover = data => {
    if (popupFeatures?.features?.length > 1) return;
    if (onPointHover)
      return dispatch(setPopupFeatures({ id: id, features: data }));
  };

  /**
   * @param {GeoJsonFeature[]} data
   */
  const handleClick = data => {
    if (onGroupClick === true && data.length > 1)
      return dispatch(setPopupFeatures({ id: id, features: data }));
    if (onPointClick === true) {
      dispatch(setDialogFeatures([data[0].properties]));
      dispatch(setPopupFeatures({ id: undefined, features: [] }));
      dispatch(toggleDialog());
    }
  };

  return pinIconConfig({
    id,
    data: getFeatures(),
    orbState,
    dispatch,
    onPointClick: handleClick,
    onGroupClick: handleClick,
    onPointHover: handleHover,
    onGroupHover: handleHover,
    ...rest,
  });
};

export default categoryFilterPinIconConfig;
