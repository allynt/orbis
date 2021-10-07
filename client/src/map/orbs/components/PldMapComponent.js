import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import { clickedFeaturesSelector, setClickedFeatures } from '../layers.slice';

const AisShippingMapComponent = ({ source }) => {
  const pickedObjects = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  const dispatch = useDispatch();

  if (!pickedObjects?.length) return null;

  return (
    <Popup
      longitude={pickedObjects[0]?.geometry.coordinates[0]}
      latitude={pickedObjects[0]?.geometry.coordinates[1]}
      onClose={() =>
        dispatch(
          setClickedFeatures({
            key: source.source_id,
            clickedFeatures: [],
          }),
        )
      }
      captureScroll
    >
      <FeatureDetail
        features={pickedObjects.map(obj => obj.properties)}
        title="Planning Policy Lead"
      />
    </Popup>
  );
};

export default AisShippingMapComponent;
