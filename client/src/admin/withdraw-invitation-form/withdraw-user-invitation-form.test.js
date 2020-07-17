import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WithdrawUserInvitationForm } from './withdraw-user-invitation-form.component';

const renderComponent = (user, withdrawInvitation, close) =>
  render(
    <WithdrawUserInvitationForm
      user={user}
      withdrawInvitation={withdrawInvitation}
      close={close}
    />,
  );

describe('WithdrawUserInvitationForm', () => {
  let user = null;
  let withdrawInvitation = null;
  let close = null;

  beforeEach(() => {
    user = { id: 1, user: { name: 'John Smith' } };
    withdrawInvitation = jest.fn();
    close = jest.fn();
  });

  it('displays name of user to be withdrawn in message text', () => {
    const { getByText } = renderComponent(user, withdrawInvitation, close);

    expect(getByText(user.user.name)).toBeInTheDocument();
  });

  it('closes when `cancel` button is clicked', () => {
    const { getByText } = renderComponent(user, withdrawInvitation, close);

    userEvent.click(getByText('Cancel'));
    expect(close).toHaveBeenCalled();
  });

  it('calls dispatch function with user and closes the dialog when `Yes` button is clicked', () => {
    const { getByText } = renderComponent(user, withdrawInvitation, close);

    userEvent.click(getByText('Yes'));
    expect(withdrawInvitation).toHaveBeenCalledWith(user);
    expect(close).toHaveBeenCalled();
  });
});
