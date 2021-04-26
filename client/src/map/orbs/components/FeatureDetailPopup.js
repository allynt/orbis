import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { centerOfMass } from '@turf/turf';

import { FeatureDetail, Popup } from 'components';

import {
  clickedFeaturesSelector,
  setClickedFeatures,
  setHoveredFeatures,
  hoveredFeaturesSelector,
} from '../layers.slice';

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

  /** @type {import('typings/orbis').GeoJsonFeature[]} */
  const hoveredFeatures = useSelector(state =>
    hoveredFeaturesSelector(source?.source_id)(state?.orbs),
  );

  const onNoteSave = text => {
    console.log('NOTE SAVE: ', text);
  };

  const getDetailContent = () => {
    if (clickedFeatures?.length) {
      return {
        features: clickedFeatures,
        action: () =>
          setClickedFeatures({
            key: source?.source_id,
            clickedFeatures: [],
          }),
      };
    }

    if (hoveredFeatures?.length) {
      return {
        features: hoveredFeatures,
        action: () =>
          setHoveredFeatures({
            key: source?.source_id,
            hoveredFeatures: [],
          }),
      };
    }
  };

  if (!clickedFeatures?.length && !hoveredFeatures?.length) return null;

  const { features, action } = getDetailContent();
  const center =
    features[0].geometry.type === 'Polygon'
      ? centerOfMass({ type: 'Feature', ...features?.[0] })
      : features[0];
  return (
    <Popup
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      offsetTop={features[0].geometry.type === 'Polygon' ? 0 : -25}
      onClose={() => dispatch(action())}
    >
      <FeatureDetail
        features={features?.map(obj => obj?.properties)}
        onNoteSave={onNoteSave}
      />
    </Popup>
  );
};

export default FeatureDetailPopup;
