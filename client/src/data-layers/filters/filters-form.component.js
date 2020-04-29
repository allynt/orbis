import React, { useReducer } from 'react';

import { Checkbox } from '@astrosat/astrosat-ui';
import { checkboxReducer } from './checkbox-reducer';
import { filterValueIsPresent } from './filter-value-is-present';

export const FiltersForm = ({ availableFilters, currentFilters, onFiltersChange }) => {
  const [state, dispatch] = useReducer(checkboxReducer, {});

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
          <button type="submit">Add Filters</button>
        </div>
      </form>
    </div>
  );
};
