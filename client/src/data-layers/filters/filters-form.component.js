import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { mergeWith, get } from 'lodash';

import { Checkbox } from '@astrosat/astrosat-ui';

const filterValueIsPresent = (object, { layer, property, value }) => {
  return !!object[layer] && object[layer][property] && object[layer][property].includes(value);
};

const addItem = (state, set, { layer, property, value }) => {
  const current = get(state, `${set}.${layer}.${property}`, []);
  return mergeWith({ [set]: { [layer]: { [property]: [...current, value] } } }, state);
};

const removeItem = (state, set, { layer, property, value }) => {
  const current = get(state, `${set}.${layer}.${property}`);
  const index = current.indexOf(value);
  current.splice(index, 1);
  return mergeWith({ [set]: { [layer]: { [property]: current } } }, state);
};

export const checkboxReducer = (state, action) => {
  switch (action.type) {
    case 'add/toAdd':
      return addItem(state, 'toAdd', action.item);
    case 'remove/toAdd':
      return removeItem(state, 'toAdd', action.item);
    case 'add/toRemove':
      return addItem(state, 'toRemove', action.item);
    case 'remove/toRemove':
      return removeItem(state, 'toRemove', action.item);
    default:
      return state;
  }
};

export const FiltersForm = ({ availableFilters, currentFilters, onFiltersChange }) => {
  const [state, dispatch] = useReducer(checkboxReducer, {});

  const handleSubmit = () => {
    onFiltersChange(state.toAdd, state.toRemove);
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
    <div>
      <form onSubmit={handleSubmit}>
        {availableFilters &&
          Object.keys(availableFilters).map(layer =>
            Object.keys(availableFilters[layer]).map(property => (
              <fieldset>
                <legend>{property}</legend>
                {availableFilters[layer][property].map(value => {
                  const defaultChecked =
                    currentFilters[layer] &&
                    currentFilters[layer][property] &&
                    currentFilters[layer][property].includes(value);
                  return (
                    <Checkbox
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
    </div>,
    document.body,
  );
};
