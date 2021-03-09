import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { DateRangeFilter } from './date-range-filter.component';
import userEvent from '@testing-library/user-event';

const renderComponent = ({ minDate = undefined, maxDate = undefined } = {}) => {
  const onSubmit = jest.fn();
  const utils = render(
    <DateRangeFilter onSubmit={onSubmit} minDate={minDate} maxDate={maxDate} />,
  );
  return { onSubmit, ...utils };
};

describe('<DateRangeFilter />', () => {
  it('Calls onSubmit when startDate changes and is valid', async () => {
    const { onSubmit, getByRole } = renderComponent();
    userEvent.type(getByRole('textbox', { name: 'Start Date' }), '01/01/2020');
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        startDate: new Date(2020, 1, 1).toISOString(),
        endDate: undefined,
      }),
    );
  });

  it('Calls onSubmit when endDate changes and is valid', async () => {
    const { onSubmit, getByRole } = renderComponent();
    userEvent.type(getByRole('textbox', { name: 'End Date' }), '01/01/2020');
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: new Date(2020, 1, 1).toISOString(),
      }),
    );
  });

  it("Doesn't allow invalid dates", async () => {
    const { onSubmit, getByRole, getByText } = renderComponent();
    userEvent.type(getByRole('textbox', { name: 'Start Date' }), '30/02/2020');
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
    expect(getByText('Please enter a valid date')).toBeInTheDocument();
  });

  it('Shows the date picker when the range button is clicked', () => {
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Show date picker' }));
    expect(getByRole('button', { name: 'Today' })).toBeInTheDocument();
  });

  it('Shows and error message when the startDate entered is less than minDate', () => {
    const { getByRole, getByText } = renderComponent({
      minDate: new Date(2000, 1, 1).toISOString(),
    });
    userEvent.type(getByRole('textbox', { name: 'Start Date' }), '31/12/1999');
    expect(getByText('Something')).toBeInTheDocument();
  });

  it('Shows an error message when the endDate entered is greater than maxDate', async () => {
    const { getByRole, getByText } = renderComponent({
      maxDate: new Date(2000, 1, 1).toISOString(),
    });
    userEvent.type(getByRole('textbox', { name: 'End Date' }), '03/02/2000');
    await waitFor(() =>
      expect(
        getByText('Date must not be after 01/02/2000'),
      ).toBeInTheDocument(),
    );
  });
});
