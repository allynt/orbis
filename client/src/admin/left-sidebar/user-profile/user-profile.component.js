import React from 'react';
import { ProfileIcon } from '@astrosat/astrosat-ui';
import styles from './user-profile.module.css';

export const UserProfile = ({ avatar, name }) => (
  <div className={styles.userProfile}>
    {avatar ? (
      <picture>
        <source srcSet={avatar} />
        <img src={avatar} alt="User Profile" className={styles.profileIcon} />
      </picture>
    ) : (
      <ProfileIcon data-testid="default-icon" classes={styles.defaultIcon} />
    )}

    <div className={styles.userInfo}>
      <h2 className={styles.name}>{name}</h2>
      <p>Administrator</p>
    </div>
  </div>
);
