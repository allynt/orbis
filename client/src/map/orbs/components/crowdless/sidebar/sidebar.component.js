import * as React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { LoadingSpinner } from 'components';
import ResultsListItem from './results-list-item/results-list-item.component';
import { ReactComponent as SearchIcon } from './search.svg';

import styles from './sidebar.module.css';

/**
 * @param {{
 *   results?: CrowdlessFeature[]
 *   isLoading?: boolean
 *   onFindClick: () => void
 *   onResultClick?: (result: CrowdlessFeature) => void
 *   selectedResult: CrowdlessFeature
 * }} props
 */
export const CrowdlessSidebarComponent = ({
  results,
  isLoading,
  onFindClick,
  onResultClick,
  selectedResult,
}) => (
  <>
    <p className={styles.text}>
      Please zoom in to the desired area or add area in the search box{' '}
      <SearchIcon
        style={{ width: '1em', height: '1em', color: 'var(--color-primary)' }}
      />{' '}
      at the top right of the map in order to get most accurate results. Then
      click the button “Find Supermarkets” below.
    </p>
    <Button
      className={styles.findButton}
      size="small"
      onClick={() => !isLoading && onFindClick()}
    >
      {isLoading ? <LoadingSpinner /> : 'Find Supermarkets'}
    </Button>
    {((isLoading && !results) || results?.length) && (
      <ul className={styles.list}>
        <p className={styles.listHeader}>Places close to you</p>
        {isLoading &&
          !results &&
          Array(10)
            .fill(undefined)
            .map((_, i) => <ResultsListItem key={i} isLoading />)}
        {results?.length &&
          results.map(result => (
            <ResultsListItem
              key={result.properties.placeId}
              result={result}
              selected={
                selectedResult === undefined ||
                result.properties.placeId ===
                  selectedResult?.properties?.placeId
              }
              onClick={onResultClick}
            />
          ))}
      </ul>
    )}
  </>
);
