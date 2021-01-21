import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import { clickedFeaturesSelector, setClickedFeatures } from '../orbReducer';

/**
 * @param {{
 * source: import('typings/orbis').Source
 * }} props
 */
const FeatureDetailPopup = ({ source }) => {
  const dispatch = useDispatch();

  /** @type {import('typings/orbis').GeoJsonFeature[]} */
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  if (!clickedFeatures?.length) return null;

  return (
    <Popup
      latitude={clickedFeatures?.[0]?.geometry.coordinates[1]}
      longitude={clickedFeatures?.[0]?.geometry.coordinates[0]}
      onClose={() =>
        dispatch(
          setClickedFeatures({
            source_id: source?.source_id,
            clickedFeatures: undefined,
          }),
        )
      }
    >
      <FeatureDetail features={clickedFeatures?.map(obj => obj?.properties)} />
    </Popup>
  );
};

export default FeatureDetailPopup;
