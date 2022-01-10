import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, startOfDay } from 'date-fns';

import { DateStepper } from './date-stepper.component';

jest.useFakeTimers();

const TODAY = startOfDay(new Date()).getTime(),
  TOMORROW = addDays(startOfDay(new Date()), 1).getTime(),
  DATES = [
    { value: TODAY, label: 'Today' },
    { value: TOMORROW, label: 'Tomorrow' },
  ];

const renderComponent = value => {
  const onChange = jest.fn();
  const utils = render(
    <DateStepper
      defaultValue={TODAY}
      value={value}
      onChange={onChange}
      dates={DATES}
    />,
  );
  return { ...utils, onChange };
};

describe('<DateStepper />', () => {
  it('Changes the button icon to pause when play is clicked', async () => {
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'play' }));
    await waitFor(() =>
      expect(getByRole('button', { name: 'pause' })).toBeInTheDocument(),
    );
  });

  it('Calls on change with the next value while playing', () => {
    jest.useFakeTimers();
    const { getByRole, onChange } = renderComponent(TODAY);

    userEvent.click(getByRole('button', { name: 'play' }));
    jest.runOnlyPendingTimers();

    expect(onChange).toHaveBeenCalledWith(undefined, TOMORROW);
  });

  it('Calls on change with the first value while playing if it reaches the end', () => {
    jest.useFakeTimers();
    const { getByRole, onChange } = renderComponent(TOMORROW);

    userEvent.click(getByRole('button', { name: 'play' }));
    jest.runOnlyPendingTimers();

    expect(onChange).toHaveBeenCalledWith(undefined, TODAY);
  });
});
