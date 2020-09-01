import React from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';

import Icons from './icons';

import styles from './checkbox-filters.module.css';

/** @type {{
 *   categories: Array
 *   selectedFeatures: Array
 *   setSelectedFeatures: Function
 * }[]}
 */

export const CheckboxFilters = ({
  categories,
  selectedFeatures,
  setSelectedFeatures,
}) => {
  const CATEGORY_NAME_AND_ICON = categories.map(name => ({
    name,
    Icon: Icons[name],
  }));

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = event => {
    if (event.target.checked) {
      console.log('Checked');
      setSelectedFeatures([...selectedFeatures, event.target.value]);
    } else {
      console.log('Unchecked');
      setSelectedFeatures(
        selectedFeatures.filter(feat => feat !== event.target.value),
      );
    }
  };

  return (
    <>
      {CATEGORY_NAME_AND_ICON.map(({ name, Icon }) => (
        <Checkbox
          key={name}
          id={name}
          className={styles.checkbox}
          defaultChecked
          name="msl-filter-checkbox"
          value={name}
          onChange={handleChange}
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
