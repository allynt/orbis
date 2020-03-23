import PropTypes from 'prop-types';
import React from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import styles from './saved-search-list.module.css';

const SavedSearchList = ({ savedSearches, setCurrentSearchQuery, deleteSavedSatelliteSearch }) => (
  <ul className={styles.list}>
    {savedSearches &&
      savedSearches.map(search => {
        return (
          <li key={search.name} className={styles.savedSearchDetail}>
            <h5>{search.name}</h5>
            <div className={styles.description}>
              <p className={styles.descriptionItem}>Saved Dates:</p>
              <p>
                {search.start_date} to {search.end_date}
              </p>
              <p className={styles.descriptionItem}>Resolution:</p>
              <p>{search.tiers.join(', ')}</p>
            </div>
            <div className={styles.buttons}>
              <Button classNames={[styles.button]} onClick={() => setCurrentSearchQuery(search)}>
                Reload
              </Button>
              <Button
                classNames={[styles.button]}
                theme="tertiary"
                onClick={() => deleteSavedSatelliteSearch(search.id)}
              >
                Delete
              </Button>
            </div>
          </li>
        );
      })}
  </ul>
);

SavedSearchList.propTypes = {
  savedSearches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      satellites: PropTypes.array,
      tiers: PropTypes.array,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      aoi: PropTypes.array,
      owner: PropTypes.number,
      created: PropTypes.string
    })
  )
};

export default SavedSearchList;
