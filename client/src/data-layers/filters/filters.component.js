import React, { useState } from 'react';

import { DataLayersFilterForm } from './data-layers-filter-form.component';

import { ReactComponent as FilterIcon } from './filter-icon.svg';
import { ReactComponent as CloseIcon } from './close.svg';

export const Filters = () => {
  const [filtersPanelVisible, setFiltersPanelVisible] = useState(false);

  return (
    <>
      <header>
        <button aria-label="Toggle filters popup" onClick={() => setFiltersPanelVisible(current => !current)}>
          {filtersPanelVisible ? <CloseIcon title="Close icon" /> : <FilterIcon title="Filter icon" />}
        </button>
        <h3>Data Filtering</h3>
        <h4>Find all the requested results</h4>
      </header>
      {filtersPanelVisible && (
        <DataLayersFilterForm
          // selectedLayers={selectedLayers}
          // onAddLayers={selectedLayers => dispatch(addLayers(selectedLayers))}
          filtersPanelVisible={filtersPanelVisible}
          setFiltersPanelVisible={setFiltersPanelVisible}
        />
      )}
    </>
  );
};
