import React from 'react';

import { ReactComponent as OrbisLogo } from '../orbis-dark.svg';

import styles from './wrapper.module.css';

const Wrapper = ({ children }) => (
  <div className={styles.page}>
    <div className={styles.container}>
      <OrbisLogo className={styles.logo} />
      {children}
    </div>
  </div>
);

export default Wrapper;
