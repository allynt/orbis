import React, { useReducer, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { checkboxReducer } from './checkbox-reducer';
import { filterValueIsPresent, areAnyFilterValuesPresent } from './filters-utils';
import { Button } from '@astrosat/astrosat-ui';
import { FiltersFormSection } from './filters-form-section.component';
import styles from './filters-form.module.css';

export const FiltersForm = ({ availableFilters, currentFilters, onFiltersChange }) => {
  const [state, dispatch] = useReducer(checkboxReducer, { toAdd: {}, toRemove: {} });
  const [buttonActionText, setButtonActionText] = useState('Add');

  useEffect(() => {
    const isRemoving = areAnyFilterValuesPresent(state.toRemove);
    const isAdding = areAnyFilterValuesPresent(state.toAdd);
    if (isAdding && isRemoving) {
      setButtonActionText('Update');
    } else if (!isAdding && isRemoving) {
      setButtonActionText('Remove');
    } else {
      setButtonActionText('Add');
    }
  }, [state]);

  const handleSubmit = () => {
    onFiltersChange && onFiltersChange(state.toAdd, state.toRemove);
  };

  const handleCheckboxChange = item => event => {
    const isChecked = event.target.checked;
    const isInCurrent = filterValueIsPresent(currentFilters, item);
    if (isChecked) {
      if (isInCurrent) {
        const isInToRemove = filterValueIsPresent(state.toRemove, item);
        if (isInToRemove) dispatch({ type: 'remove/toRemove', item: item });
      } else {
        dispatch({ type: 'add/toAdd', item: item });
      }
    } else {
      if (isInCurrent) {
        dispatch({ type: 'add/toRemove', item: item });
      } else {
        const isInToAdd = filterValueIsPresent(state.toAdd, item);
        if (isInToAdd) dispatch({ type: 'remove/toAdd', item: item });
      }
    }
  };

  return ReactDOM.createPortal(
    <form className={styles.filtersForm} onSubmit={handleSubmit}>
      {availableFilters &&
        Object.keys(availableFilters).map(layer =>
          Object.keys(availableFilters[layer]).map(property => (
            <FiltersFormSection
              key={`${layer}.${property}`}
              options={availableFilters[layer][property]}
              layer={layer}
              property={property}
              currentFilters={currentFilters}
              onCheckboxChange={handleCheckboxChange}
            />
          )),
        )}
      <Button className={styles.submit} type="submit">{`${buttonActionText} Filters`}</Button>
    </form>,
    document.body,
  );
};
