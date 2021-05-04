import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StatusFilter } from './status-filter.component';

const options = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETE', label: 'Complete' },
  { value: 'FOLLOWUP', label: 'Followup' },
];

const renderComponent = ({ status, onSubmit = jest.fn() }) => {
  const utils = render(
    <StatusFilter
      status={status}
      options={options}
      label="Test Label"
      onSubmit={onSubmit}
    />,
  );

  return { ...utils, onSubmit };
};

describe('Status Filter', () => {
  it('renders a status filter dropdown', () => {
    const { getByRole, getByText, getAllByText } = renderComponent({});

    const button = getByRole('button', { name: 'Status Select' });

    expect(button).toBeInTheDocument();

    userEvent.click(button);

    options
      .filter(o => o.label !== 'All')
      .forEach(({ label }) => {
        expect(getByText(label)).toBeInTheDocument();
      });
  });

  it('defaults filter value to `All` if status if not present', () => {
    const { getByRole, getAllByText } = renderComponent({ status: null });

    userEvent.click(getByRole('button', { name: 'Status Select' }));

    expect(getAllByText('All').length).toEqual(2);
  });

  it('is set to provided status if present', () => {
    const { getByRole, getAllByText } = renderComponent({ status: 'PENDING' });

    userEvent.click(getByRole('button', { name: 'Status Select' }));

    expect(getAllByText('Pending').length).toEqual(2);
  });

  it('calls submit callback when new option is selected', () => {
    const { getByRole, getByText, onSubmit } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Status Select' }));
    userEvent.click(getByText('Pending'));

    expect(onSubmit).toHaveBeenCalledWith('PENDING');
  });
});
