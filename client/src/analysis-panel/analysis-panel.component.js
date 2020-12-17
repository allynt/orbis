import * as React from 'react';

import { omitBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { CloseButton } from '@astrosat/astrosat-ui';

import { SidePanel } from 'components/side-panel/side-panel.component';
import {
  pickedInfoSelector,
  propertySelector,
  setPickedInfo,
} from 'map/orbs/slices/isolation-plus.slice';

import styles from './analysis-panel.module.css';
import { MoreInformation } from './more-information/more-information.component';

export const AnalysisPanel = () => {
  const dispatch = useDispatch();
  const pickedInfo = useSelector(state => pickedInfoSelector(state?.orbs));
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  const values = omitBy(
    pickedInfo?.object?.properties,
    (_, key) =>
      key !== selectedProperty.name && !key.toLowerCase().includes('code'),
  );

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
      {Object.entries(values).map(([key, value]) => (
        <div className={styles.dataItem}>
          <p className={styles.dataKey}>{key}:</p>
          <p>{value}</p>
        </div>
      ))}
      <MoreInformation
        details={selectedProperty?.details}
        source={selectedProperty?.source}
      />
    </SidePanel>
  );
};
