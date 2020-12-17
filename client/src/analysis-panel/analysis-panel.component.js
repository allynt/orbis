import React, { useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { CloseButton } from '@astrosat/astrosat-ui';

import { SidePanel } from 'components';
import {
  pickedInfoSelector,
  propertySelector,
  setPickedInfo,
} from 'map/orbs/slices/isolation-plus.slice';
import { NationalDeviationHistogram } from './national-deviation-histogram/national-deviation-histogram.component';
import { PropertyBreakdownChart } from './property-breakdown-chart/property-breakdown-chart.component';

import styles from './analysis-panel.module.css';

export const AnalysisPanel = () => {
  const dispatch = useDispatch();
  const pickedInfo = useSelector(state => pickedInfoSelector(state?.orbs));
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  if (!selectedProperty) return null;

  const areaValue = pickedInfo?.object?.properties?.[selectedProperty?.name];

  const pieData = selectedProperty?.breakdown?.map(breakdownProperty => ({
    value: Number(pickedInfo?.object?.properties[breakdownProperty]),
    name: breakdownProperty,
  }));

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
      {!!areaValue && (
        <NationalDeviationHistogram
          areaValue={
            typeof areaValue !== 'number' ? Number(areaValue) : areaValue
          }
          selectedProperty={selectedProperty}
        />
      )}
      {!!selectedProperty?.breakdown && !pieData.some(v => !v.value) && (
        <>
          <div
            style={{
              margin: '0 auto',
              width: '90%',
              height: 1,
              opacity: 0.39,
              backgroundColor: 'var(--color-primary)',
            }}
          />
          <PropertyBreakdownChart data={pieData} />
        </>
      )}
    </SidePanel>
  );
};
