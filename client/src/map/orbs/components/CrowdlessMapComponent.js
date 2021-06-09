import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import {
  selectedResultSelector,
  setSelectedResult,
} from '../slices/crowdless.slice';
import CrowdlessMapComponent from './crowdless/map/map.component';

const ConnectedWrapper = () => {
  const dispatch = useDispatch();
  const selectedResult = useSelector(state =>
    selectedResultSelector(state.orbs),
  );

  return selectedResult ? (
    <Popup
      longitude={selectedResult?.geometry?.coordinates[0]}
      latitude={selectedResult?.geometry?.coordinates[1]}
      onClose={() => dispatch(setSelectedResult(undefined))}
    >
      <FeatureDetail>
        <CrowdlessMapComponent feature={selectedResult} />
      </FeatureDetail>
    </Popup>
  ) : null;
};

export default ConnectedWrapper;
