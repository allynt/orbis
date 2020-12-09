import React from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';

import Icons from './icons';

import styles from './checkbox-filters.module.css';
import { CATEGORIES } from '../../slices/mysupplylynk.constants';
import { useSelector } from 'react-redux';
import {
  categoryFiltersSelector,
  setSelectedFeatures,
} from '../../slices/mysupplylynk.slice';

/** @param {{
 *   selectedLayer?: any
 *   dispatch?: any
 * }} props
 */
export const CheckboxFilters = ({ selectedLayer, dispatch }) => {
  const selectedFeatures = useSelector(state =>
    categoryFiltersSelector(state.orbs),
  );

  const sourceCategories = selectedFeatures?.[selectedLayer.source_id];

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
      ? dispatch(
          setSelectedFeatures({
            type: selectedLayer.source_id,
            value: [...sourceCategories, value],
          }),
        )
      : dispatch(
          setSelectedFeatures({
            type: selectedLayer.source_id,
            value: sourceCategories.filter(feat => feat !== value),
          }),
        );
  };

  return (
    <>
      {CATEGORY_NAME_AND_ICON.map(({ name, Icon }) => {
        const checked = sourceCategories.includes(name);
        return (
          <Checkbox
            key={name}
            id={name}
            className={styles.checkbox}
            checked={checked}
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
        );
      })}
    </>
  );
};
