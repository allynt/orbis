import React from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';

import Icons from './icons';

import styles from './checkbox-filters.module.css';
import { CATEGORIES } from '../../mySupplyLynk/mysupplylynk.constants';
import { useSelector } from 'react-redux';
import {
  categoryFiltersSelector,
  setSelectedFeatures,
} from '../../mySupplyLynk/mysupplylynk.slice';

/** @param {{
 *   source?: any
 *   dispatch?: any
 * }} props
 */
export const CheckboxFilters = ({ dispatch }) => {
  const selectedFeatures = useSelector(state =>
    categoryFiltersSelector(state.orbs),
  );
  const CATEGORY_NAME_AND_ICON = CATEGORIES.map(name => ({
    name,
    Icon: Icons[name],
  }));

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = event => {
    const {
      target: { value, checked },
    } = event;

    checked
      ? dispatch(setSelectedFeatures([...selectedFeatures, value]))
      : dispatch(
          setSelectedFeatures(selectedFeatures.filter(feat => feat !== value)),
        );
  };

  return (
    <>
      {CATEGORY_NAME_AND_ICON.map(({ name, Icon }) => (
        <Checkbox
          key={name}
          id={name}
          className={styles.checkbox}
          checked={selectedFeatures?.includes(name)}
          name="msl-filter-checkbox"
          value={name}
          onChange={handleChange}
          ariaLabel={name}
          label={
            <span className={styles.label}>
              <div className={styles.iconWrapper}>
                <Icon className={styles.icon} title={name} />
              </div>
              {name}
            </span>
          }
        />
      ))}
    </>
  );
};
