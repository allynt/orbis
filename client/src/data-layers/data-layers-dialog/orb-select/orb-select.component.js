import clsx from 'clsx';
import React from 'react';

import dialogStyles from '../data-layers-dialog.module.css';
import styles from './orb-select.module.css';

/**
 * @param {{
 *   orbs: Source['orbs']
 *   selectedOrbName: string
 *   onOrbClick: (orb: string) => void
 * }} props
 */
export const OrbSelect = ({ orbs, selectedOrbName, onOrbClick }) => (
  <div className={styles.categories}>
    <h3 className={dialogStyles.header}>Select Your Orb</h3>
    <ul className={dialogStyles.list}>
      {orbs?.map(orb => (
        <li
          className={clsx(styles.orb, {
            [styles.selected]: orb.name === selectedOrbName,
          })}
          key={orb.name}
          role="button"
          onClick={() => onOrbClick(orb.name)}
        >
          {orb.name}
        </li>
      ))}
    </ul>
  </div>
);
