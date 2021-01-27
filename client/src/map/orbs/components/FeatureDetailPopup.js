import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import {
  clickedFeaturesSelector,
  setClickedFeatures,
  setHoveredFeatures,
  hoveredFeaturesSelector,
} from '../orbReducer';

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

  const getDetailContent = () => {
    if (clickedFeatures?.length) {
      return {
        features: clickedFeatures,
        action: () =>
          setClickedFeatures({
            source_id: source?.source_id,
            clickedFeatures: [],
          }),
      };
    }

    if (hoveredFeatures?.length) {
      return {
        features: hoveredFeatures,
        action: () =>
          setHoveredFeatures({
            source_id: source?.source_id,
            hoveredFeatures: [],
          }),
      };
    }
  };

  if (!clickedFeatures?.length && !hoveredFeatures?.length) return null;

  const { features, action } = getDetailContent();
  return (
    <Popup
      latitude={features?.[0]?.geometry.coordinates[1]}
      longitude={features?.[0]?.geometry.coordinates[0]}
      onClose={() => dispatch(action())}
    >
      <FeatureDetail features={features?.map(obj => obj?.properties)} />
    </Popup>
  );
};

export default FeatureDetailPopup;
