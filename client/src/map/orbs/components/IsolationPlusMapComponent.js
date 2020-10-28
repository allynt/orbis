import FeatureDetail from 'components/feature-detail/feature-detail.component';
import { omitBy } from 'lodash';
import React, { useEffect } from 'react';
import { Popup } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import {
  pickedInfoSelector,
  propertySelector,
  setPickedInfo,
} from '../slices/isolation-plus.slice';

const IsolationPlusMapComponent = () => {
  const dispatch = useDispatch();
  const pickedInfo = useSelector(state => pickedInfoSelector(state.orbs));
  const selectedProperty = useSelector(state => propertySelector(state.orbs));

  useEffect(() => {
    if (selectedProperty && pickedInfo) {
      if (pickedInfo.layer.id !== selectedProperty.source_id)
        setPickedInfo(undefined);
    }
  }, [selectedProperty, pickedInfo]);

  if (!pickedInfo) return null;

  return (
    <Popup
      key="isolationPlusPopup"
      longitude={pickedInfo.lngLat[0]}
      latitude={pickedInfo.lngLat[1]}
      onClose={() => dispatch(setPickedInfo(undefined))}
      captureScroll
    >
      <FeatureDetail
        features={[
          omitBy(
            pickedInfo.object.properties,
            (_, key) =>
              key !== selectedProperty.name &&
              !key.toLowerCase().includes('code'),
          ),
        ]}
        title="Metadata"
      />
    </Popup>
  );
};

export default IsolationPlusMapComponent;
