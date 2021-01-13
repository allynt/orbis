import * as React from 'react';

import { BarChart, SidePanelSection } from 'components';

import styles from './national-deviation-histogram.module.css';

/**
 * @param {{
 *  areaValue: number
 *  selectedProperty: import('typings/orbis').Property
 * }} props
 */
export const NationalDeviationHistogram = ({ areaValue, selectedProperty }) => {
  return (
    <SidePanelSection
      defaultExpanded
      title={<span className={styles.sectionTitle}>Selected Data Layer</span>}
    >
      <p className={styles.propertyLabel}>{selectedProperty?.label}</p>
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
        line={areaValue}
      />
      <div className={styles.values}>
        <p className={`${styles.areaValue} ${styles.valueLabel}`}>
          Value of selected area:
        </p>
        <p className={styles.areaValue}>{areaValue}</p>
        <p className={styles.valueLabel}>
          {selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average'} of all
          areas in GB:
        </p>
        <p> {selectedProperty?.aggregates?.GB}</p>
      </div>
    </SidePanelSection>
  );
};
