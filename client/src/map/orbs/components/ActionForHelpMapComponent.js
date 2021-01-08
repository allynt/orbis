import { FeatureDetail, Popup } from 'components';
import { pickBy } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  pickedObjectsSelector,
  setPickedObjects,
} from '../slices/action-for-help.slice';

const ActionForHelpMapComponent = () => {
  const pickedObjects = useSelector(pickedObjectsSelector);
  const dispatch = useDispatch();
  if (!pickedObjects.length) return null;
  return (
    <Popup
      longitude={pickedObjects[0]?.geometry.coordinates[0]}
      latitude={pickedObjects[0]?.geometry.coordinates[1]}
      onClose={() => dispatch(setPickedObjects([]))}
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
