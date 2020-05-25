import React, { useState } from 'react';

import { FiltersForm } from './filters-form.component';

import { FilterIconIcon, CloseIcon } from '@astrosat/astrosat-ui/';

import styles from './filters.module.css';

export const Filters = ({ availableFilters, currentFilters, onFiltersChange }) => {
  const [filtersPanelVisible, setFiltersPanelVisible] = useState(false);

  const handleFiltersChange = (toAdd, toRemove) => {
    setFiltersPanelVisible(current => !current);
    onFiltersChange && onFiltersChange(toAdd, toRemove);
  };

  console.log('Icon: ', <CloseIcon />);

  return (
    <div className={styles.filtersContainer}>
      <header className={styles.filters}>
        <button
          className={styles.popupToggleButton}
          aria-label="Toggle filters popup"
          onClick={() => setFiltersPanelVisible(current => !current)}
        >
          {filtersPanelVisible ? (
            <CloseIcon classes={styles.icon} title="Close icon" />
          ) : (
            <FilterIconIcon classes={styles.icon} title="Filter icon" />
          )}
        </button>
        <h3 className={styles.heading}>Data Filtering</h3>
        <h4 className={styles.strapline}>Find all the requested results</h4>
      </header>
      {filtersPanelVisible && (
        <FiltersForm
          availableFilters={availableFilters}
          currentFilters={currentFilters}
          onFiltersChange={handleFiltersChange}
        />
      )}
    </div>
  );
};
