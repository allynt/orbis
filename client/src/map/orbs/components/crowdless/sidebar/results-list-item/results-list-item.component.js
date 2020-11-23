import * as React from 'react';

import clsx from 'clsx';

import { Skeleton } from 'components';
import { Busy, NotBusy, VeryBusy } from './icons';

import styles from './results-list-item.module.css';

const ResultsListItemSkeleton = () => (
  <>
    <Skeleton className={styles.icon} width="1.429em" height="1.429em" />
    <Skeleton width="10ch" height="1.15em" />
    <Skeleton width="30ch" height="1.15em" />
  </>
);

/**
 * @param {CrowdlessFeatureProperties['crowdednessCategory']} crowdednessCategory
 */
const getIcon = crowdednessCategory => {
  switch (crowdednessCategory) {
    case 'not busy':
      return NotBusy;
    case 'busy':
      return Busy;
    case 'very busy':
      return VeryBusy;
    default:
      return () => null;
  }
};

/**
 * @param {{
 *   isLoading?: boolean
 *   result?: CrowdlessFeature
 *   selected?: boolean
 * }} props
 */
const ResultsListItem = ({ isLoading = false, result, selected = true }) => {
  const Icon = getIcon(result?.properties?.crowdednessCategory);

  return (
    <li className={clsx(styles.listItem, { [styles.selected]: selected })}>
      {isLoading ? (
        <ResultsListItemSkeleton />
      ) : (
        <>
          <Icon
            className={styles.icon}
            title={result?.properties?.crowdednessCategory}
          />
          <p className={styles.name}>{result?.properties?.name}</p>
          <p className={styles.address}>{result?.properties?.address}</p>
        </>
      )}
    </li>
  );
};

export default ResultsListItem;
