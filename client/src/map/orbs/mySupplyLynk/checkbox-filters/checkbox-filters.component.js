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
    const {
      target: { value, checked },
    } = event;

    checked
      ? setSelectedFeatures([...selectedFeatures, value])
      : setSelectedFeatures(selectedFeatures.filter(feat => feat !== value));
  };

  return (
    <>
      {CATEGORY_NAME_AND_ICON.map(({ name, Icon }) => (
        <Checkbox
          key={name}
          id={name}
          data-testid={`${name}-checkbox`}
          className={styles.checkbox}
          checked={selectedFeatures.includes(name)}
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
