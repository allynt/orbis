import React from 'react';

import { Button, makeStyles } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import { FeatureDetail, Popup } from 'components';

import { clickedFeaturesSelector, setClickedFeatures } from '../layers.slice';

const useStyles = makeStyles(theme => ({
  bodyFooter: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
}));

const TascomiMapComponent = ({ source }) => {
  const styles = useStyles();

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
        title="Feature Detail"
        dateFormat="yyyy-MM-dd"
      >
        <div className={styles.bodyFooter}>
          <Button
            onClick={() =>
              dispatch(
                push(`dashboard?source_id=astrosat/tascomi/dashboard/latest`),
              )
            }
          >
            View Project
          </Button>
        </div>
      </FeatureDetail>
    </Popup>
  );
};

export default TascomiMapComponent;
