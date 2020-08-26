import React from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';

import { CATEGORIES } from '../mysupplylynk.constants';
import Icons from './icons';

import styles from './checkbox-filters.module.css';

/** @type {{
 *   Icon: React.FunctionComponent,
 *   name: string
 * }[]}
 */
const CATEGORY_NAME_AND_ICON = CATEGORIES.map(name => ({
  name,
  Icon: Icons[name],
}));

export const CheckboxFilters = () => {
  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = event => {
    // This tells you the value of the checkbox which has changed
    // and whether it is now checked or not.
    // Will be enough to maintain a list of items to filter by in state.
    // The initial state should be an array of all the categories
    console.log(event.target.value, event.target.checked);
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
