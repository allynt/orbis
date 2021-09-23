import React from 'react';

import {
  customer as testCustomer,
  pendingUsers as testPendingUsers,
} from 'mission-control/views/users-view/test-story-data';
import { render, screen, userEvent } from 'test/test-utils';

import { PendingInvitationsBoard } from './pending-invitations-board.component';

const setup = ({
  pendingUsers = testPendingUsers,
  customer = testCustomer,
  ...rest
}) => {
  render(
    <PendingInvitationsBoard
      pendingUsers={pendingUsers}
      customer={customer}
      {...rest}
    />,
  );
};

describe('PendingUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];
  const onWithdrawInvitationClick = jest.fn();
  const onResendInvitationClick = jest.fn();

  it.each(cases)("Displays all pending user's %s", (_, text) => {
    setup({});
    testPendingUsers.forEach(user =>
      expect(screen.getByText(user.user[text])).toBeInTheDocument(),
    );
  });

  it('Displays user Orb licence names', () => {
    setup({});

    expect(screen.getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  it('Displays a placeholder if no customer is present', () => {
    setup({ customer: null });

    testPendingUsers.forEach((_, i) =>
      expect(
        screen.getAllByText('Not currently available')[i],
      ).toBeInTheDocument(),
    );
  });

  it('Displays a placeholder when customer is present but has no licences', () => {
    setup({ customer: { name: 'Customer Name' } });

    expect(screen.queryByText('No licences')).not.toBeInTheDocument();

    testPendingUsers.forEach((_, i) =>
      expect(
        screen.getAllByText('Not currently available')[i],
      ).toBeInTheDocument(),
    );
  });

  it('Displays a placeholder when user has no licences', () => {
    const TEST_USER = {
      ...testPendingUsers[0],
      id: '99',
    };

    setup({ pendingUsers: [TEST_USER] });

    expect(
      screen.queryByText('Not currently available'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('No licences')).toBeInTheDocument();
  });

  it('Calls resendInvitation when `Resend Invitation` button is clicked', () => {
    setup({ onResendInvitationClick });

    const resendInvitationButton = screen.getAllByText('Resend Invitation')[0];
    expect(resendInvitationButton).toBeInTheDocument();
    userEvent.click(resendInvitationButton);
    expect(onResendInvitationClick).toHaveBeenCalledWith(testPendingUsers[0]);
  });

  it('Opens `Withdraw Invitation` dialog when button is clicked', () => {
    setup({ onWithdrawInvitationClick });

    userEvent.click(screen.getAllByTestId('options-icon')[0]);

    const optionsDropdownButton = screen.getByText('Withdraw');

    expect(optionsDropdownButton).toBeInTheDocument();
    userEvent.click(optionsDropdownButton);
    expect(onWithdrawInvitationClick).toHaveBeenCalledWith(testPendingUsers[0]);
  });
});
