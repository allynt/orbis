import * as React from 'react';

import { Button, Radio } from '@astrosat/astrosat-ui';

import { LoadingSpinner } from 'components';
import { InfoIconTooltip } from 'components/info-icon-tooltip/info-icon-tooltip.component';
import { Description } from './description.component';
import ResultsListItem from './results-list-item/results-list-item.component';
import { ReactComponent as SearchIcon } from './search.svg';
import styles from './sidebar.module.css';

/**
 * @param {{
 *   results?: CrowdlessFeature[]
 *   isLoading?: boolean
 *   onFindClick: () => void
 *   onRadioChange: () => void
 *   visible?: boolean
 * }} props
 */
export const CrowdlessSidebarComponent = ({
  results,
  isLoading,
  onFindClick,
  onRadioChange,
  visible,
}) => (
  <>
    <div className={styles.radioWrapper}>
      <Radio
        onClick={onRadioChange}
        checked={visible}
        label="Supermarket Crowdedness"
      />
      <InfoIconTooltip className={styles.infoIcon} place="right">
        <Description />
      </InfoIconTooltip>
    </div>
    {visible && (
      <>
        <p className={styles.text}>
          Please zoom in to the desired area or add area in the search box{' '}
          <SearchIcon className={styles.searchIcon} /> at the top right of the
          map in order to get most accurate results. Then click the button “Find
          Supermarkets” below.
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
                  key={result.properties.placeID}
                  result={result}
                />
              ))}
          </ul>
        )}
      </>
    )}
  </>
);
