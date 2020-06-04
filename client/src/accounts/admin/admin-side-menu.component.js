import React from 'react';

import { ReactComponent as OrbisLogo } from '../../orbis.svg';

import { ProfileIcon, ProgressBar, Button } from '@astrosat/astrosat-ui/';

import { USER_TABLE, ACTIVITY_LOG, LICENCE_DASHBOARD, CORPORATE_ACCOUNT, MESSAGES } from './admin.component';
import styles from './admin-side-menu.module.css';

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
          <ProfileIcon classes={styles.buttonIcon} />
          Home
        </Button>
        <Button classNames={styles.button} theme="link" href="/" rel="noopener noreferrer" target="_blank">
          <ProfileIcon classes={styles.buttonIcon} />
          Launch Orbis
        </Button>
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(CORPORATE_ACCOUNT)}>
          <ProfileIcon classes={styles.buttonIcon} />
          Corporate Account
        </Button>
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(LICENCE_DASHBOARD)}>
          <ProfileIcon classes={styles.buttonIcon} />
          Licence Dashboard
        </Button>
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(ACTIVITY_LOG)}>
          <ProfileIcon classes={styles.buttonIcon} />
          Activity Log
        </Button>
        <Button classNames={styles.button} theme="link" onClick={() => setVisiblePanel(MESSAGES)}>
          <ProfileIcon classes={styles.buttonIcon} />
          Messages
        </Button>
      </div>
      <div className={styles.storage}>
        <div className={styles.storageHeader}>
          <ProfileIcon classes={styles.storageIcon} />
          Storage
        </div>
        <ProgressBar classes={styles.progressBar} percentage={selectedCustomer.data_total} />
        <p
          className={styles.storageInfo}
        >{`${selectedCustomer.data_total}GB of ${selectedCustomer.data_limit}GB storage`}</p>
      </div>
    </div>
  </div>
);

export default AdminSideMenu;
