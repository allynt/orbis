import React from 'react';

import styles from './company-menu.module.css';

const CompanyMenu = () => (
  <div className={styles.companyMenu}>
    <div className={styles.companyInfo}>
      <picture>
        <img
          className={styles.companyLogo}
          src="https://www.logodesignlove.com/images/monograms/tesla-symbol.jpg"
          alt="Company Logo"
        />
      </picture>
      <h2>Tesla, Inc</h2>
    </div>
    <div className={styles.buttons}>
      <button>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
      <button>Button 4</button>
    </div>
  </div>
);

export default CompanyMenu;
