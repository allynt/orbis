import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import { popupFeaturesSelector, setPopupFeatures } from '../orbReducer';

/**
 * @param {{
 * source: import('typings/orbis').Source
 * }} props
 */
const FeatureDetailPopup = ({ source }) => {
  const dispatch = useDispatch();

  /** @type {import('typings/orbis').GeoJsonFeature[]} */
  const popupFeatures = useSelector(state =>
    popupFeaturesSelector(source?.source_id)(state?.orbs),
  );

  if (!popupFeatures?.length) return null;

  return (
    <Popup
      latitude={popupFeatures?.[0]?.geometry.coordinates[1]}
      longitude={popupFeatures?.[0]?.geometry.coordinates[0]}
      onClose={() =>
        dispatch(
          setPopupFeatures({
            source_id: source?.source_id,
            popupFeatures: [],
          }),
        )
      }
    >
      <FeatureDetail features={popupFeatures?.map(obj => obj?.properties)} />
    </Popup>
  );
};

export default FeatureDetailPopup;
