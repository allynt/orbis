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

const label = 'Test Label';

const renderComponent = ({ value, onChange = jest.fn() }) => {
  const utils = render(
    <DropdownFilter
      value={value}
      options={options}
      defaultValue="ALL"
      label={label}
      onChange={onChange}
    />,
  );

  return { ...utils, onChange };
};

describe('Dropdown Filter', () => {
  it('renders a dropdown filter', () => {
    const { getByRole } = renderComponent({});

    expect(getByRole('button', { name: 'All' })).toBeInTheDocument();

    userEvent.click(getByRole('button', { name: 'All' }));

    options
      .filter(o => o.label !== 'All')
      .forEach(({ label }) => {
        expect(getByRole('option', { name: label })).toBeInTheDocument();
      });
  });

  it('defaults filter value to `All` if value if not present', () => {
    const { getByText } = renderComponent({ value: null });

    expect(getByText('All')).toBeInTheDocument();
  });

  it('is set to provided value if present', () => {
    const { getByText } = renderComponent({ value: 'PENDING' });

    expect(getByText('Pending')).toBeInTheDocument();
  });

  it('calls submit callback when new option is selected', () => {
    const { getByRole, getAllByRole, onChange } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'All' }));
    userEvent.click(getByRole('option', { name: 'Pending' }));

    expect(onChange).toHaveBeenCalledWith('PENDING');
  });
});
