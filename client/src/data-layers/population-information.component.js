import React from 'react';

import { personTypes } from 'map/map.constants';

import styles from './population-information.module.css';

const upperCaseToTitleCase = text => {
  const lower = text.toLowerCase();
  const firstChar = lower.slice(0, 1);
  const rest = lower.slice(1);
  return [firstChar.toUpperCase(), ...rest].join('');
};

export const PopulationInformation = () => (
  <ul>
    {personTypes.map(personType => (
      <li key={personType.name} className={styles.listItem}>
        <div
          className={styles.colorBox}
          style={{
            backgroundColor: personType.color
          }}
        />
        {upperCaseToTitleCase(personType.name)}
      </li>
    ))}
  </ul>
);
