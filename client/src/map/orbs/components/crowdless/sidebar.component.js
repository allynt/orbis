import { Button } from '@astrosat/astrosat-ui';
import { LoadingSpinner } from 'components';
import * as React from 'react';
import ResultsListItem from './results-list-item/results-list-item.component';

/**
 * @param {{
 *   results?: CrowdlessFeature[]
 *   isLoading?: boolean
 *   onFindClick: () => void
 * }} props
 */
export const CrowdlessSidebarComponent = ({
  results,
  isLoading,
  onFindClick,
}) => (
  <>
    <Button onClick={onFindClick}>
      {isLoading ? <LoadingSpinner /> : 'Find Supermarkets'}
    </Button>
    {((isLoading && !results) || results?.length) && (
      <ul>
        Places close to you
        {isLoading &&
          !results &&
          Array(10)
            .fill(undefined)
            .map(() => <ResultsListItem isLoading />)}
        {results?.length &&
          results.map(result => <ResultsListItem result={result} />)}
      </ul>
    )}
  </>
);
