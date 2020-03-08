import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { selectSearchQuery, deleteSavedSatelliteSearch } from './satellites.actions';

import styles from './saved-search-list.module.css';

const SavedSearchList = ({ searches }) => {
  const dispatch = useDispatch();

  return (
    <ul className={styles.searches}>
      {searches &&
        searches.map(search => {
          return (
            <li key={search.name} className={styles.search}>
              <div onClick={() => dispatch(selectSearchQuery(search))}>{search.name}</div>
              <Button onClick={() => dispatch(deleteSavedSatelliteSearch(search.id))}>Delete</Button>
            </li>
          );
        })}
    </ul>
  );
};

SavedSearchList.propTypes = {};

export default SavedSearchList;
