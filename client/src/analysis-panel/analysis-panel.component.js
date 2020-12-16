import * as React from 'react';

import { omitBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { CloseButton } from '@astrosat/astrosat-ui';

import { BarChart, SidePanel } from 'components';
import {
  pickedInfoSelector,
  propertySelector,
  setPickedInfo,
} from 'map/orbs/slices/isolation-plus.slice';

import styles from './analysis-panel.module.css';

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
      <BarChart
        color={selectedProperty?.application?.orbis?.display?.color}
        domain={[selectedProperty?.min, selectedProperty?.max]}
        clip={[selectedProperty?.clip_min, selectedProperty?.clip_max]}
        labelX={selectedProperty?.label}
        labelY="Number of Areas"
        data={
          selectedProperty?.application?.orbis?.data_visualisation_components
            ?.props?.data || []
        }
        line={pickedInfo?.object?.properties?.[selectedProperty?.name]}
      />
      {Object.entries(values).map(([key, value]) => (
        <div className={styles.dataItem}>
          <p className={styles.dataKey}>{key}:</p>
          <p>{value}</p>
        </div>
      ))}
    </SidePanel>
  );
};
