import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DropdownFilter } from './dropdown-filter.component';

export const options = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETE', label: 'Complete' },
  { value: 'FOLLOWUP', label: 'Followup' },
];

const renderComponent = ({ value, onSubmit = jest.fn() }) => {
  const utils = render(
    <DropdownFilter
      value={value}
      options={options}
      defaultValue="ALL"
      label="Test Label"
      onSubmit={onSubmit}
    />,
  );

  return { ...utils, onSubmit };
};

describe('Dropdown Filter', () => {
  it('renders a dropdown filter', () => {
    const { getByRole, getByText } = renderComponent({});

    const button = getByRole('button', { name: 'Test Label' });

    expect(button).toBeInTheDocument();

    userEvent.click(button);

    options
      .filter(o => o.label !== 'All')
      .forEach(({ label }) => {
        expect(getByText(label)).toBeInTheDocument();
      });
  });

  it('defaults filter value to `All` if value if not present', () => {
    const { getByRole, getAllByText } = renderComponent({ value: null });

    userEvent.click(getByRole('button', { name: 'Test Label' }));

    expect(getAllByText('All').length).toEqual(2);
  });

  it('is set to provided value if present', () => {
    const { getByRole, getAllByText } = renderComponent({ value: 'PENDING' });

    userEvent.click(getByRole('button', { name: 'Test Label' }));

    expect(getAllByText('Pending').length).toEqual(2);
  });

  it('calls submit callback when new option is selected', () => {
    const { getByRole, getByText, onSubmit } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Test Label' }));
    userEvent.click(getByText('Pending'));

    expect(onSubmit).toHaveBeenCalledWith('PENDING');
  });
});
