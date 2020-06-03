import React from 'react';

import { ReactComponent as OrbisLogo } from '../../orbis.svg';

import ProfileIcon from '@astrosat/astrosat-ui/dist/icons/profile-icon';

import { USER_TABLE, ACTIVITY_LOG, LICENCE_DASHBOARD, CORPORATE_ACCOUNT, MESSAGES } from './admin.component';
import styles from './admin-side-menu.module.css';

const AdminSideMenu = ({ user, setVisiblePanel }) => (
  <div className={styles.sideMenu}>
    <OrbisLogo className={styles.logo} onClick={() => setVisiblePanel(USER_TABLE)} data-testid="orbis logo" />
    <div className={styles.content}>
      <div className={styles.userProfile}>
        {user.avatar ? (
          <picture>
            <source srcSet={user.avatar} />
            <img src={user.avatar} alt="User Profile" className={styles.profileIcon} />
          </picture>
        ) : (
          <ProfileIcon data-testid="default-icon" classes={styles.defaultIcon} />
        )}

        <div className={styles.userInfo}>
          <h2>{user.name}</h2>
          <p>Administrator</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => setVisiblePanel(USER_TABLE)}>Home</button>
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
