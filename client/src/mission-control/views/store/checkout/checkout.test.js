import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkout } from './checkout.component';

const renderComponent = errors => {
  const onConfirmClick = jest.fn();
  const utils = render(
    <Checkout
      // @ts-ignore
      orbs={[{ id: 1, name: 'Test Orb', licence_cost: 0 }]}
      // @ts-ignore
      location={{ search: '?users=10&orbId=1' }}
      errors={errors}
      onConfirmClick={onConfirmClick}
    />,
  );
  return { ...utils, onConfirmClick };
};

describe('<Checkout />', () => {
  it('Shows fields populated with the order information', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('textbox', { name: /name of the product/i })).toHaveValue(
      'Test Orb',
    );
    expect(getByRole('textbox', { name: /licence/i })).toHaveValue('Free');
    expect(
      getByRole('textbox', { name: /the number of users you need/i }),
    ).toHaveValue('10');
  });

  it('Has the confirm button disabled if the terms have not been agreed', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: /confirm/i })).toBeDisabled();
    userEvent.click(getByRole('checkbox'));
    expect(getByRole('button', { name: /confirm/i })).toBeEnabled();
  });

  it('Calls onConfirmClick when the confirm button is clicked', () => {
    const { getByRole, onConfirmClick } = renderComponent();
    userEvent.click(getByRole('checkbox'));
    userEvent.click(getByRole('button'));
    expect(onConfirmClick).toBeCalledWith({ orbId: 1, users: 10 });
  });

  it('Shows errors if there are any', () => {
    const { getByRole, getByText } = renderComponent(['this is an error']);
    expect(getByRole('alert')).toBeInTheDocument();
    expect(getByText('this is an error')).toBeInTheDocument();
  });
});
