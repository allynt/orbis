import { FeatureDetail, Popup } from 'components';
import { omitBy } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clickedFeaturesSelector,
  propertySelector,
  setClickedFeatures,
} from '../slices/isolation-plus.slice';

/**
 * @param {{
 *  source?: Source
 * }} props
 */
const IsolationPlusMapComponent = ({ source }) => {
  const dispatch = useDispatch();
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(state.orbs),
  );
  const selectedProperty = useSelector(state => propertySelector(state.orbs));

  if (
    !clickedFeatures ||
    clickedFeatures?.[0]?.layer.id !== selectedProperty.source_id ||
    source?.source_id !== clickedFeatures?.[0]?.layer.id
  )
    return null;

  return (
    <Popup
      key="isolationPlusPopup"
      longitude={clickedFeatures?.[0]?.lngLat[0]}
      latitude={clickedFeatures?.[0]?.lngLat[1]}
      onClose={() => dispatch(setClickedFeatures(undefined))}
      captureScroll
    >
      <FeatureDetail
        features={[
          omitBy(
            clickedFeatures?.[0]?.object?.properties,
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
