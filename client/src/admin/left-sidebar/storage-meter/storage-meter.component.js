import React from 'react';
import { ProgressBar, ProfileIcon } from '@astrosat/astrosat-ui';
import styles from './storage-meter.module.css';

export const StorageMeter = ({ total, limit }) => (
  <div className={styles.storage}>
    <div className={styles.storageHeader}>
      <ProfileIcon classes={styles.storageIcon} />
      Storage
    </div>
    <ProgressBar percentage={total} />
    <p className={styles.storageInfo}>{`${total}GB of ${limit}GB storage`}</p>
  </div>
);
