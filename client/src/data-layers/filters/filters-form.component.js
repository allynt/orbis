import React, { useReducer, useState, useEffect } from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';
import { checkboxReducer } from './checkbox-reducer';
import { filterValueIsPresent, areAnyFilterValuesPresent } from './filters-utils';

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

  const handleSubmit = event => {
    event.preventDefault();
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {availableFilters &&
          Object.keys(availableFilters).map(layer =>
            Object.keys(availableFilters[layer]).map(property => (
              <fieldset key={`${layer}.${property}`}>
                <legend>{property}</legend>
                {availableFilters[layer][property].map(value => {
                  const defaultChecked = filterValueIsPresent(currentFilters, { layer, property, value });
                  return (
                    <Checkbox
                      key={`${layer}.${property}.${value}`}
                      label={value}
                      defaultChecked={defaultChecked}
                      onChange={handleCheckboxChange({ layer, property, value })}
                    />
                  );
                })}
              </fieldset>
            )),
          )}
        <div>
          <button type="submit">{`${buttonActionText} Filters`}</button>
        </div>
      </form>
    </div>
  );
};
