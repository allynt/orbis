import * as React from 'react';

import { LayersListItem } from 'data-layers/layers-list/layers-list-item/layers-list-item.component';

import styles from './more-information.module.css';

/**
 * @param {{
 *  details?: string
 *  source?: string
 * }} props
 */
export const MoreInformation = ({ details, source }) => (
  <LayersListItem
    title={<span className={styles.title}>More Information</span>}
    defaultExpanded
  >
    <div className={styles.information}>
      {details && <p className={styles.details}>{details}</p>}
      {source && (
        <>
          <p className={styles.sourceLabel}>Source:</p>
          <p className={styles.source}>{source}</p>
        </>
      )}
    </div>
  </LayersListItem>
);
