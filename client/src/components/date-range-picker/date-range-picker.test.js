import { render } from '@testing-library/react';
import { DateRangePicker } from './date-range-picker.component';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('<DateRangePicker />', () => {
  it('calls onApply with the selected range when clicked', () => {
    const onApply = jest.fn();
    const { getByRole, getAllByRole } = render(
      <DateRangePicker
        onApply={onApply}
        initialRange={{
          startDate: new Date(2020, 0, 5),
          endDate: new Date(2020, 0, 10),
        }}
      />,
    );
    userEvent.click(getAllByRole('button', { name: '1' })[1]);
    userEvent.click(getAllByRole('button', { name: '2' })[0]);
    userEvent.click(getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith({
      startDate: new Date(2020, 1, 1),
      endDate: new Date(2020, 1, 2),
    });
  });
});
