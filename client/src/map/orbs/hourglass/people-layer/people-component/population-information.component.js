import React from 'react';

import { toTitleCase } from 'utils/text';

import styles from './population-information.module.css';

const personTypes = [
  {
    name: 'VOLUNTEER',
    color: '#6cc24a',
  },
  {
    name: 'RECIPIENT',
    color: '#f6e800',
  },
  // Removed for hourglass
  /* {
    name: 'REPORTER',
    color: 'yellow',
  }, */
];

export const PopulationInformation = () => (
  <ul>
    {personTypes.map(personType => (
      <li key={personType.name} className={styles.listItem}>
        <div
          className={styles.colorBox}
          style={{
            backgroundColor: personType.color,
          }}
        />
        {toTitleCase(personType.name)}
      </li>
    ))}
    <li className={styles.listItem}>
      <div
        className={styles.colorBox}
        style={{
          backgroundColor: '#8031A7',
        }}
      />
      Group
    </li>
  </ul>
);
