import React from 'react';

import { personTypes } from 'map/map.constants';

import { toTitleCase } from 'utils/text';

import styles from './population-information.module.css';

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
        {toTitleCase(personType.name)}
      </li>
    ))}
  </ul>
);
