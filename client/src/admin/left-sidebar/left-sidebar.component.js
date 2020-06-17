import React from 'react';

import { ReactComponent as OrbisLogo } from '../../orbis.svg';
import { ReactComponent as HomeIcon } from './home.svg';
import { ReactComponent as LaunchOrbisIcon } from './launch-orbis.svg';
import { ReactComponent as MessagesIcon } from './messages.svg';
import { ReactComponent as LicencesIcon } from './licenses.svg';
import { ReactComponent as ActivityLogIcon } from './log.svg';

import { ProfileIcon, Button } from '@astrosat/astrosat-ui/';

import { USER_TABLE, ACTIVITY_LOG, LICENCE_DASHBOARD, MESSAGES } from '../admin.component';
import styles from './left-sidebar.module.css';

const AdminSideMenu = ({ user, selectedCustomer, setVisiblePanel }) => (
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
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(USER_TABLE)}>
          <HomeIcon className={styles.buttonIcon} />
          Home
        </Button>
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(MESSAGES)}>
          <MessagesIcon className={styles.buttonIcon} />
          Messages
        </Button>
        <Button classNames={styles.button} theme="link" href="/" rel="noopener noreferrer" target="_blank">
          <LaunchOrbisIcon className={styles.buttonIcon} />
          Launch Orbis
        </Button>
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(ACTIVITY_LOG)}>
          <ActivityLogIcon className={styles.buttonIcon} />
          Activity Log
        </Button>
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(LICENCE_DASHBOARD)}>
          <LicencesIcon className={styles.buttonIcon} />
          Licence Dashboard
        </Button>
      </div>
    </div>
  </div>
);

export default AdminSideMenu;
