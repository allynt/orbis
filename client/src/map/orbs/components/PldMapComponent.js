import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import { clickedFeaturesSelector, setClickedFeatures } from '../layers.slice';

const PldMapComponent = ({ source }) => {
  const pickedObjects = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  const dispatch = useDispatch();

  if (!pickedObjects?.length) return null;

  return (
    <Popup
      longitude={pickedObjects[0]?.geometry.coordinates[0]}
      latitude={pickedObjects[0]?.geometry.coordinates[1]}
      dynamicPosition={true}
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
        propertiesToOmit={['icon', 'Status Category']}
        title={pickedObjects[0].properties['Development Type']}
        labelMapping={{
          decision_date: 'Approval Date',
          actual_commencement_date: 'Commencement Date',
          actual_completion_date: 'Completion Date',
          lapsed_date: 'Lapsed Date',
        }}
      />
    </Popup>
  );
};

export default PldMapComponent;
