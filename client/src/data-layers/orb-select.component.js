import React from 'react';

import styles from './data-layers-dialog.module.css';

export const OrbSelect = ({ domains, onDomainClick }) => (
  <div className={styles.categories}>
    <div className={styles.header}>
      <h3>Select Your Orb</h3>
    </div>

    <div className={styles.content}>
      <ul>
        {domains.map(domain => (
          <li key={domain.label} onClick={() => onDomainClick(domain)}>
            {domain.label}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
