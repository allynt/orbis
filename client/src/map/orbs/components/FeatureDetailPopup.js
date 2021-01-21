import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Popup } from 'components';

import { clickedFeaturesSelector, setClickedFeatures } from '../orbReducer';

/**
 * @param {{
 * source: import('typings/orbis').Source
 * }} props
 */
const FeatureDetailPopup = ({ source }) => {
  const dispatch = useDispatch();

  /** @type {import('typings/orbis').PickedMapFeature[]} */
  const clickedFeatures = useSelector(
    clickedFeaturesSelector(source?.source_id),
  );

  console.log('ClickedFeatures: ', clickedFeatures);
  if (!clickedFeatures?.length) return null;
  return (
    <Popup
      latitude={clickedFeatures?.[0]?.object.geometry.coordinates[1]}
      longitude={clickedFeatures?.[0]?.object.geometry.coordinates[0]}
      onClose={() =>
        dispatch(
          setClickedFeatures({
            source_id: source?.source_id,
            clickedFeatures: [],
          }),
        )
      }
    >
      <div>Hello from FeatureDetailPopup</div>
    </Popup>
  );
};

export default FeatureDetailPopup;
