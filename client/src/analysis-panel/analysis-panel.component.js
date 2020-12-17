import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { CloseButton } from '@astrosat/astrosat-ui';

import { SidePanel } from 'components';
import {
  pickedInfoSelector,
  propertySelector,
  setPickedInfo,
} from 'map/orbs/slices/isolation-plus.slice';

import styles from './analysis-panel.module.css';
import { MoreInformation } from './more-information/more-information.component';
import { NationalDeviationHistogram } from './national-deviation-histogram/national-deviation-histogram.component';

export const AnalysisPanel = () => {
  const dispatch = useDispatch();
  const pickedInfo = useSelector(state => pickedInfoSelector(state?.orbs));
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  const areaValue = pickedInfo?.object?.properties?.[selectedProperty?.name];

  return (
    <SidePanel
      orientation="right"
      open={
        !!selectedProperty?.application?.orbis?.data_visualisation_components &&
        !!pickedInfo
      }
      contentClassName={styles.data}
      header={
        <div className={styles.header}>
          <CloseButton
            className={styles.close}
            onClick={() => dispatch(setPickedInfo(undefined))}
          />
          <h1 className={styles.heading}>Data Analysis</h1>
        </div>
      }
    >
      <p className={styles.strapline}>
        The information below relates to the areas selected on the map.
      </p>
      <NationalDeviationHistogram
        areaValue={areaValue}
        selectedProperty={selectedProperty}
      />
      <MoreInformation
        details={selectedProperty?.details}
        source={selectedProperty?.source}
      />
    </SidePanel>
  );
};
