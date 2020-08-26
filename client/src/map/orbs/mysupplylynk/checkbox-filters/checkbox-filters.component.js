import React from 'react';
import * as Icons from './icons';
import { Checkbox } from '@astrosat/astrosat-ui';

import styles from './checkbox-filters.module.css';

/** @type {{
 *   Icon: React.FunctionComponent,
 *   name: string
 * }[]}
 */
const CATEGORIES = [
  {
    name: 'PPE',
    Icon: Icons.PPE,
  },
  {
    name: 'Cleaning and Domestic',
    Icon: Icons.Cleaning,
  },
  { name: 'Medical Equipment and Aids', Icon: Icons.Medical },
  { name: 'Foods', Icon: Icons.Food },
  { name: 'Stationary', Icon: Icons.Stationery },
  { name: 'Clothing', Icon: Icons.Clothing },
  { name: 'Services', Icon: Icons.Services },
  { name: 'Staffing', Icon: Icons.Staffing },
  { name: 'Miscellaneous', Icon: Icons.Other },
];

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
      {CATEGORIES.map(({ name, Icon }) => (
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
