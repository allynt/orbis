import React from 'react';

import { centerOfMass } from '@turf/turf';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import { clickedFeaturesSelector, setClickedFeatures } from '../layers.slice';

/**
 * @param {{
 * source: import('typings').Source
 * }} props
 */
const RiceDemoPopup = ({ source }) => {
  const dispatch = useDispatch();

  /** @type {import('typings').GeoJsonFeature[]} */
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  if (!clickedFeatures?.length) return null;

  const center = centerOfMass({ type: 'Feature', ...clickedFeatures?.[0] });
  return (
    <Popup
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      onClose={() =>
        dispatch(
          setClickedFeatures({
            key: source?.source_id,
            clickedFeatures: [],
          }),
        )
      }
    >
      <FeatureDetail
        features={clickedFeatures?.map(obj =>
          Object.entries(obj?.properties).reduce((acc, [key, value]) => {
            return {
              ...acc,
              [key.toUpperCase()]: value.map(({ timestamp, value }) => ({
                [format(new Date(timestamp), 'yyyy-MMM-dd')]: value,
              })),
            };
          }, {}),
        )}
      />
    </Popup>
  );
};

export default RiceDemoPopup;
