import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StatusFilter } from './status-filter.component';
import { OPTIONS } from '../popup-status-and-note/status-constants';

const renderComponent = ({ status, onSubmit = jest.fn() }) => {
  const utils = render(<StatusFilter status={status} onSubmit={onSubmit} />);

  return { ...utils, onSubmit };
};

describe('Status Filter', () => {
  it('renders a status filter dropdown', () => {
    const { getByRole, getByText } = renderComponent({});

    const button = getByRole('button', { name: 'Status Select' });

    expect(button).toBeInTheDocument();

    userEvent.click(button);

    Object.values(OPTIONS).forEach(value => {
      expect(getByText(value)).toBeInTheDocument();
    });
  });

  it('defaults filter value to `All` if status if not present', () => {
    const { getByRole } = renderComponent({ status: null });

    expect(getByRole('button', { name: 'Status Select' })).toHaveValue('ALL');
  });

  it('is set to provided status if present', () => {
    const { getByRole } = renderComponent({ status: 'COMPLETE' });

    expect(getByRole('button', { name: 'Status Select' })).toHaveValue(
      'COMPLETE',
    );
  });

  it('calls submit callback when new option is selected', () => {
    const { getByRole, getByText, onSubmit } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Status Select' }));
    userEvent.click(getByText('Pending'));

    expect(onSubmit).toHaveBeenCalledWith('PENDING');
  });
});
