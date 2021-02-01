import { FeatureDetail, Popup } from 'components';
import { pickBy } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clickedFeaturesSelector, setClickedFeatures } from '../orbReducer';

const ActionForHelpMapComponent = ({ source }) => {
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
            source_id: source.source_id,
            clickedFeatures: [],
          }),
        )
      }
      captureScroll
    >
      <FeatureDetail
        features={pickedObjects.map(obj =>
          pickBy(
            obj.properties,
            (_, key) =>
              !key.toLowerCase().includes('type') &&
              !key.toLowerCase().includes('pk'),
          ),
        )}
        title={
          pickedObjects[0].properties.Type
            ? 'User Details'
            : 'Infrastructure Details'
        }
      />
    </Popup>
  );
};

export default ActionForHelpMapComponent;
