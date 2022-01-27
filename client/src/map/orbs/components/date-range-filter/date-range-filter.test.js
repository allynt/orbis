import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, endOfDay, format, startOfDay } from 'date-fns';

import { DateRangeFilter } from './date-range-filter.component';

const renderComponent = ({
  minDate = undefined,
  maxDate = undefined,
  range = undefined,
} = {}) => {
  const onSubmit = jest.fn();
  const utils = render(
    <DateRangeFilter
      onSubmit={onSubmit}
      minDate={minDate}
      maxDate={maxDate}
      range={range}
    />,
  );
  return { onSubmit, ...utils };
};

describe('<DateRangeFilter />', () => {
  it('Calls onSubmit when dates are selected using the picker and apply is clicked', async () => {
    const { getByRole, getAllByRole, onSubmit } = renderComponent({
      range: {
        startDate: new Date(2020, 0, 1).toISOString(),
        endDate: new Date(2020, 0, 31).toISOString(),
      },
    });
    const today = startOfDay(new Date(2020, 0, 2));
    userEvent.click(getByRole('button', { name: 'Show date picker' }));
    userEvent.click(
      getAllByRole('button', { name: today.getDate().toString() })[0],
    );
    userEvent.click(
      getAllByRole('button', { name: (today.getDate() + 1).toString() })[0],
    );
    userEvent.click(getByRole('button', { name: 'Apply' }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        endDate: endOfDay(addDays(today, 1)).toISOString(),
        startDate: today.toISOString(),
      }),
    );
  });

  it('Calls onSubmit when startDate changes and is valid', async () => {
    const { onSubmit, getByRole } = renderComponent();
    userEvent.type(getByRole('textbox', { name: 'Start Date' }), '01/01/2020');
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        startDate: startOfDay(new Date(2020, 0, 1)).toISOString(),
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
        endDate: endOfDay(new Date(2020, 0, 1)).toISOString(),
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
    const { getByRole, queryByRole } = renderComponent();
    expect(queryByRole('button', { name: 'Today' })).not.toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'Show date picker' }));
    expect(getByRole('button', { name: 'Today' })).toBeInTheDocument();
  });

  it('Shows and error message when the startDate entered is less than minDate', async () => {
    const { getByRole, getByText } = renderComponent({
      minDate: new Date(2000, 0, 1).toISOString(),
    });
    userEvent.type(getByRole('textbox', { name: 'Start Date' }), '31/12/1999');
    await waitFor(() =>
      expect(
        getByText('Date must not be before 01/01/2000'),
      ).toBeInTheDocument(),
    );
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

  it("Uses today's date as minDate if value is 'today'", async () => {
    const today = new Date();
    const { getByRole, getByText } = renderComponent({ minDate: 'today' });
    userEvent.type(
      getByRole('textbox', { name: 'Start Date' }),
      format(addDays(today, -1), 'dd/MM/yyyy'),
    );
    await waitFor(() =>
      expect(
        getByText(`Date must not be before ${format(today, 'dd/MM/yyyy')}`),
      ).toBeInTheDocument(),
    );
  });

  it("Uses today's date as maxDate if value is 'today'", async () => {
    const today = new Date();
    const { getByRole, getByText } = renderComponent({ maxDate: 'today' });
    userEvent.type(
      getByRole('textbox', { name: 'End Date' }),
      format(addDays(today, 1), 'dd/MM/yyyy'),
    );
    await waitFor(() =>
      expect(
        getByText(`Date must not be after ${format(today, 'dd/MM/yyyy')}`),
      ).toBeInTheDocument(),
    );
  });

  it('uses existing values if provided', () => {
    const { getByRole, getByText } = renderComponent({
      range: {
        startDate: new Date(2020, 0, 1).toISOString(),
        endDate: new Date(2020, 0, 31).toISOString(),
      },
    });
    expect(getByRole('textbox', { name: 'Start Date' })).toHaveValue(
      '01/01/2020',
    );
    expect(getByRole('textbox', { name: 'End Date' })).toHaveValue(
      '31/01/2020',
    );
    userEvent.click(getByRole('button', { name: 'Show date picker' }));
    expect(getByText('01/01/2020 - 31/01/2020')).toBeInTheDocument();
  });

  it('Calls onSubmit with empty values when reset is clicked', () => {
    const { getByRole, onSubmit } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Reset' }));
    expect(onSubmit).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
    });
  });
});
