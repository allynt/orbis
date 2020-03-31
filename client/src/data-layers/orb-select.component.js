import React from 'react';

import dialogStyles from './data-layers-dialog.module.css';
import styles from './orb-select.module.css';

export const OrbSelect = ({ domains, selectedDomain, onDomainClick }) => (
  <div className={styles.categories}>
    <div className={dialogStyles.header}>
      <h3>Select Your Orb</h3>
    </div>
    <div className={dialogStyles.content}>
      <ul className={styles.orbList}>
        {domains.map(domain => (
          <li
            className={`${(!selectedDomain || domain.label === selectedDomain?.label) && styles.selected}`}
            key={domain.label}
            onClick={() => onDomainClick(domain)}
            data-testid={`orb-select-${domain.label}`}
          >
            {domain.label}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
