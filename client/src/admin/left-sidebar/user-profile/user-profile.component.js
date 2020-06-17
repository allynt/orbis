import React from 'react';
import { ProfileIcon } from '@astrosat/astrosat-ui';
import styles from './user-profile.module.css';

export const UserProfile = ({ avatar, name }) => (
  <div className={styles.userProfile}>
    {avatar ? (
      <img src={avatar} alt="User Profile" className={styles.profileIcon} />
    ) : (
      <ProfileIcon title="Profile Icon" classes={styles.defaultIcon} />
    )}

    <div className={styles.userInfo}>
      <h2 className={styles.name}>{name}</h2>
      <p className={!name ? styles.name : styles.role}>Administrator</p>
    </div>
  </div>
);
