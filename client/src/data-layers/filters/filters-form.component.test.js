import React from 'react';
import { FiltersForm } from './filters-form.component';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const buttonTextRegex = /^(Add|Remove|Update)\sFilters$/gm;

const setup = (currentFilters = {}) => {
  const availableFilters = {
    fruit: {
      type: ['citrus', 'berry'],
    },
    cars: {
      engine: ['V6', 'V8', 'V10', 'V12'],
    },
  };
  const onFiltersChange = jest.fn();
  return {
    ...render(
      <FiltersForm
        availableFilters={availableFilters}
        currentFilters={currentFilters}
        onFiltersChange={onFiltersChange}
      />,
    ),
    availableFilters,
    onFiltersChange,
  };
};

describe('FiltersForm', () => {
  it('has an "Add Filters" button by default', () => {
    const { getByText } = setup();
    const addButton = getByText('Add Filters');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveProperty('type', 'submit');
  });

  it('has sections for each supplied filter set', () => {
    const { getByText, availableFilters } = setup();
    for (let layer of Object.values(availableFilters)) {
      for (let property of Object.keys(layer)) {
        expect(getByText(property, { exact: false })).toBeInTheDocument();
      }
    }
  });

  it('has checkboxes for each supplied filter option', () => {
    const { getByLabelText, availableFilters } = setup();
    for (let layer of Object.values(availableFilters)) {
      for (let property of Object.values(layer)) {
        for (let value of property) {
          expect(getByLabelText(value, { exact: false })).toBeInTheDocument();
        }
      }
    }
  });

  it('renders a checkbox as checked if it already has the filter applied', () => {
    const currentFilters = { cars: { engine: ['V6'] } };
    const { getByLabelText } = setup(currentFilters);
    expect(getByLabelText(currentFilters.cars.engine[0])).toHaveProperty(
      'defaultChecked',
      true,
    );
  });

  it('calls the onFiltersChange when the submit button is pressed', () => {
    const { getByText, onFiltersChange } = setup();
    userEvent.click(getByText(buttonTextRegex));
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('calls the onFiltersChange with any filters which have been added', async () => {
    const { getByText, getByLabelText, onFiltersChange } = setup();
    const expected = { cars: { engine: ['V8'] } };
    userEvent.click(getByLabelText(expected.cars.engine[0]));
    userEvent.click(getByText(buttonTextRegex));
    expect(onFiltersChange).toHaveBeenCalledWith(expected, {});
  });

  it('calls the onFiltersChange with any filters which have been removed', () => {
    const currentFilters = { cars: { engine: ['V8'] } };
    const { getByText, getByLabelText, onFiltersChange } = setup(
      currentFilters,
    );
    userEvent.click(getByLabelText(currentFilters.cars.engine[0]));
    userEvent.click(getByText(buttonTextRegex));
    expect(onFiltersChange).toHaveBeenCalledWith({}, currentFilters);
  });

  it('calls the onFiltersChange with filters which were both added and removed', () => {
    const toRemove = { cars: { engine: ['V8'] } };
    const toAdd = { fruit: { type: ['berry'] } };
    const { getByText, getByLabelText, onFiltersChange } = setup(toRemove);
    userEvent.click(getByLabelText(toRemove.cars.engine[0]));
    userEvent.click(getByLabelText(toAdd.fruit.type[0]));
    userEvent.click(getByText(buttonTextRegex));
    expect(onFiltersChange).toHaveBeenCalledWith(toAdd, toRemove);
  });

  it("does not call onFiltersChange with toAdd items which are in currentFilters if they're double checked", () => {
    const currentFilters = {
      cars: { engine: ['V8'] },
    };
    const { getByLabelText, getByText, onFiltersChange } = setup(
      currentFilters,
    );
    userEvent.dblClick(getByLabelText(currentFilters.cars.engine[0]));
    userEvent.click(getByText(buttonTextRegex));
    expect(onFiltersChange).toHaveBeenCalledWith({}, { cars: { engine: [] } });
  });

  it('does not call onFiltersChange with toAdd items which have been toggled on then off', () => {
    const {
      getByLabelText,
      getByText,
      onFiltersChange,
      availableFilters,
    } = setup();
    userEvent.click(getByLabelText(availableFilters.fruit.type[0]));
    userEvent.click(getByLabelText(availableFilters.fruit.type[0]));
    userEvent.click(getByText(buttonTextRegex));
    expect(onFiltersChange).toHaveBeenCalledWith({ fruit: { type: [] } }, {});
  });

  it('keeps the button text as "Add Filters" if the user is only adding filters', () => {
    const { getByText, getByLabelText, availableFilters } = setup();
    userEvent.click(getByLabelText(availableFilters.cars.engine[0]));
    expect(getByText('Add Filters')).toBeInTheDocument();
  });

  it('changes the button text to "Remove Filters" if the user is only removing filters', () => {
    const currentFilters = { cars: { engine: ['V8'] } };
    const { queryByText, getByLabelText } = setup(currentFilters);
    userEvent.click(getByLabelText(currentFilters.cars.engine[0]));
    expect(queryByText('Remove Filters')).toBeInTheDocument();
  });

  it('changes the button text to "Update Filters" if the user is adding and removing filters', () => {
    const toRemove = { cars: { engine: ['V8'] } };
    const toAdd = { fruit: { type: ['berry'] } };
    const { queryByText, getByLabelText } = setup(toRemove);
    userEvent.click(getByLabelText(toRemove.cars.engine[0]));
    userEvent.click(getByLabelText(toAdd.fruit.type[0]));
    expect(queryByText('Update Filters')).toBeInTheDocument();
  });
});
