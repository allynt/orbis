import React from 'react';

import { ReactComponent as OrbisLogo } from '../../orbis.svg';

import { HOME, ACTIVITY_LOG, LICENCE_DASHBOARD, CORPORATE_ACCOUNT, MESSAGES } from './admin.component';
import styles from './admin-side-menu.module.css';

const AdminSideMenu = ({ user, setVisiblePanel }) => (
  <div className={styles.sideMenu}>
    <OrbisLogo className={styles.logo} />
    <div className={styles.content}>
      <div className={styles.userProfile}>
        <picture>
          <img
            className={styles.userImage}
            src="https://www.hashatit.com/images/uploads/users/66144/profile_picture/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg"
            alt="User Profile"
          />
        </picture>
        <div className={styles.userInfo}>
          <h2>John Smith</h2>
          <p>Administrator</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => setVisiblePanel(HOME)}>Home</button>
        <a href="/" rel="noopener noreferrer" target="_blank">
          Launch Orbis
        </a>
        <button onClick={() => setVisiblePanel(CORPORATE_ACCOUNT)}>Corporate Account</button>
        <button onClick={() => setVisiblePanel(LICENCE_DASHBOARD)}>Licence Dashboard</button>

        <button onClick={() => setVisiblePanel(ACTIVITY_LOG)}>Activity Log</button>
        <button onClick={() => setVisiblePanel(MESSAGES)}>Messages</button>
      </div>
      <div className={styles.storage}>Storage Meter Goes Here</div>
    </div>
  </div>
);

export default AdminSideMenu;
