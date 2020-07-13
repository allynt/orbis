import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { WithdrawUserInvitationForm } from './withdraw-user-invitation-form.component';

describe('WithdrawUserInvitationForm', () => {
  let user = null;
  let withdrawInvitation = null;
  let close = null;

  beforeEach(() => {
    user = { id: 1, user: { name: 'John Smith' } };
    withdrawInvitation = jest.fn();
    close = jest.fn();
  });

  afterEach(cleanup);

  it('displays name of user to be withdrawn in message text', () => {
    const { getByText } = render(
      <WithdrawUserInvitationForm
        user={user}
        withdrawInvitation={withdrawInvitation}
        close={close}
      />,
    );

    expect(getByText(user.user.name)).toBeInTheDocument();
  });

  it('closes when `cancel` button is clicked', () => {
    const { getByText } = render(
      <WithdrawUserInvitationForm
        user={user}
        withdrawInvitation={withdrawInvitation}
        close={close}
      />,
    );
    fireEvent.click(getByText('Cancel'));
    expect(close).toHaveBeenCalled();
  });

  it('calls dispatch function with user and closes the dialog when `Yes` button is clicked', () => {
    const { getByText } = render(
      <WithdrawUserInvitationForm
        user={user}
        withdrawInvitation={withdrawInvitation}
        close={close}
      />,
    );
    fireEvent.click(getByText('Yes'));
    expect(withdrawInvitation).toHaveBeenCalledWith(user);
    expect(close).toHaveBeenCalled();
  });
});
