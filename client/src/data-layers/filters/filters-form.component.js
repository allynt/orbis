import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { mergeWith, get } from 'lodash';

import { Checkbox } from '@astrosat/astrosat-ui';

const filterValueIsPresent = (object, item) => {
  const [layer, property, value] = item.split('.');
  return !!object[layer] && object[layer][property] && object[layer][property].includes(value);
};

const addItem = (state, set, item) => {
  const [layer, property, value] = item.split('.');
  const current = get(state, `${set}.${layer}.${property}`, []);
  return mergeWith({ [set]: { [layer]: { [property]: [...current, value] } } }, state);
};

const removeItem = (state, set, item) => {
  const [layer, property, value] = item.split('.');
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

  const handleCheckboxChange = path => event => {
    const isChecked = event.target.checked;
    const isInCurrent = filterValueIsPresent(currentFilters, path);
    if (isChecked) {
      if (isInCurrent) {
        const isInToRemove = filterValueIsPresent(state.toRemove, path);
        if (isInToRemove) dispatch({ type: 'remove/toRemove', item: path });
      } else {
        dispatch({ type: 'add/toAdd', item: path });
      }
    } else {
      if (isInCurrent) {
        dispatch({ type: 'add/toRemove', item: path });
      } else {
        const isInToAdd = filterValueIsPresent(state.toAdd, path);
        if (isInToAdd) dispatch({ type: 'remove/toAdd', item: path });
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
                      onChange={handleCheckboxChange(`${layer}.${property}.${value}`)}
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
