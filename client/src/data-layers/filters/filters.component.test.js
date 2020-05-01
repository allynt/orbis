import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { Filters } from './filters.component';

describe('Filters', () => {
  it('should render the heading', () => {
    const { getByText } = render(<Filters />);
    expect(getByText('Data Filtering')).toBeInTheDocument();
  });

  it('should render the strapline', () => {
    const { getByText } = render(<Filters />);
    expect(getByText('Find all the requested results')).toBeInTheDocument();
  });

  it('should render the icon button', () => {
    const { getByLabelText } = render(<Filters />);
    expect(getByLabelText('Toggle filters popup')).toBeInTheDocument();
  });

  it('should show the filter icon in the icon button when the filters popup is closed', () => {
    const { getByTitle } = render(<Filters />);
    expect(getByTitle('Filter icon')).toBeInTheDocument();
  });

  it('should open the filters popup when it is not visible and the icon button is clicked', () => {
    const { getByLabelText, getByText } = render(<Filters />);
    userEvent.click(getByLabelText('Toggle filters popup'));
    expect(getByText('Add Filters')).toBeInTheDocument();
  });

  it('should show an X in the icon button when the filters popup is open', () => {
    const { getByLabelText, getByTitle } = render(<Filters />);
    userEvent.click(getByLabelText('Toggle filters popup'));
    expect(getByTitle('Close icon')).toBeInTheDocument();
  });

  it('should close the filters popup when the popup is visible and the icon button is clicked', () => {
    const { getByLabelText, getByText, queryByText } = render(<Filters />);
    userEvent.click(getByLabelText('Toggle filters popup'));
    expect(getByText('Add Filters')).toBeInTheDocument();
    userEvent.click(getByLabelText('Toggle filters popup'));
    expect(queryByText('Add Filters')).not.toBeInTheDocument();
  });

  it('closes the popup when the "Add Filters" button is clicked', () => {
    const { getByLabelText, getByText, queryByText } = render(<Filters />);
    userEvent.click(getByLabelText('Toggle filters popup'));
    userEvent.click(getByText('Add Filters'));
    expect(queryByText('Add Filters')).not.toBeInTheDocument();
  });

  it('does not call onFiltersChange when changes are made to the filters but the close button is clicked', () => {
    const availableFilters = { cars: { engine: ['V8'] } };
    const onFiltersChange = jest.fn();
    const { getByLabelText } = render(
      <Filters availableFilters={availableFilters} onFiltersChange={onFiltersChange} />,
    );
    userEvent.click(getByLabelText('Toggle filters popup'));
    userEvent.click(getByLabelText(availableFilters.cars.engine[0]));
    userEvent.click(getByLabelText('Toggle filters popup'));
    expect(onFiltersChange).not.toHaveBeenCalled();
  });
});
