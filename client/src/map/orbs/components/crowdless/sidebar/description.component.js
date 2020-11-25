import * as React from 'react';
import { Busy, NotBusy, VeryBusy } from './icons';
import styles from './description.module.css';

export const Description = () => (
  <div className={styles.description}>
    <h1 className={styles.heading}>Estimated a crowdedness score:</h1>
    <NotBusy className={styles.icon} />
    <p>
      Not so busy (1-35%) means there are few people present and no queues are
      expected.
    </p>
    <Busy className={styles.icon} />
    <p>
      Busy (36-70%) means there are many people present and often queues form.
    </p>
    <VeryBusy className={styles.icon} />
    <p>
      Very busy (over 70%) means there are likely to be large crowds or long
      queues.
    </p>
  </div>
);
