import React, { useState } from 'react';

import { FiltersForm } from './filters-form.component';

import FilterIconIcon from '@astrosat/astrosat-ui/dist/icons/filter-icon-icon';

import CloseIcon from '@astrosat/astrosat-ui/dist/icons/close-icon';

import styles from './filters.module.css';

export const Filters = ({ availableFilters, currentFilters, onFiltersChange }) => {
  const [filtersPanelVisible, setFiltersPanelVisible] = useState(false);

  const handleFiltersChange = (toAdd, toRemove) => {
    setFiltersPanelVisible(current => !current);
    onFiltersChange && onFiltersChange(toAdd, toRemove);
  };

  return (
    <div className={styles.filtersContainer}>
      <header className={styles.filters}>
        <button
          className={styles.popupToggleButton}
          aria-label="Toggle filters popup"
          onClick={() => setFiltersPanelVisible(current => !current)}
        >
          {filtersPanelVisible ? (
            <CloseIcon classNames={styles.icon} title="Close icon" />
          ) : (
            <FilterIconIcon classes={[styles.icon]} title="Filter icon" />
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
