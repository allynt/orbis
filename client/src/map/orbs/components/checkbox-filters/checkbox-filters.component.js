import React from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';

import Icons from './icons';

import styles from './checkbox-filters.module.css';
import { CATEGORIES } from '../../slices/mysupplylynk.constants';
import { useSelector } from 'react-redux';
import {
  categoryFiltersSelectorFactory,
  setSelectedFeatures,
} from '../../slices/mysupplylynk.slice';

/** @param {{
 *   selectedLayer?: any
 *   dispatch?: any
 * }} props
 */
export const CheckboxFilters = ({ selectedLayer, dispatch }) => {
  const selectedFilters = useSelector(state =>
    categoryFiltersSelectorFactory(selectedLayer?.source_id)(state.orbs),
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
      ? dispatch(
          setSelectedFeatures({
            layer: selectedLayer.source_id,
            value: [...selectedFilters, value],
          }),
        )
      : dispatch(
          setSelectedFeatures({
            layer: selectedLayer.source_id,
            value: selectedFilters.filter(feat => feat !== value),
          }),
        );
  };

  return (
    <>
      {CATEGORY_NAME_AND_ICON.map(({ name, Icon }) => (
        <Checkbox
          key={name}
          id={`${selectedLayer?.source_id}-${name}`}
          className={styles.checkbox}
          checked={selectedFilters?.includes(name)}
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
