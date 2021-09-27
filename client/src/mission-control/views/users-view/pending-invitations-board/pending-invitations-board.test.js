import React from 'react';

import {
  customer as testCustomer,
  pendingUsers as testPendingUsers,
} from 'mission-control/views/users-view/test-story-data';
import { render, screen, userEvent } from 'test/test-utils';

import { PendingInvitationsBoard } from './pending-invitations-board.component';

describe('PendingUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];

  it.each(cases)("Displays all pending user's %s", (_, text) => {
    render(
      <PendingInvitationsBoard
        pendingUsers={testPendingUsers}
        customer={testCustomer}
      />,
    );

    testPendingUsers.forEach(user =>
      expect(screen.getByText(user.user[text])).toBeInTheDocument(),
    );
  });

  it('Displays user Orb licence names', () => {
    render(
      <PendingInvitationsBoard
        pendingUsers={testPendingUsers}
        customer={testCustomer}
      />,
    );

    expect(screen.getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  it('Displays a placeholder if no customer is present', () => {
    render(
      <PendingInvitationsBoard
        pendingUsers={testPendingUsers}
        customer={null}
      />,
    );

    testPendingUsers.forEach((_, i) =>
      expect(
        screen.getAllByText('Not currently available')[i],
      ).toBeInTheDocument(),
    );
  });

  it('Displays a placeholder when customer is present but has no licences', () => {
    render(
      <PendingInvitationsBoard
        pendingUsers={testPendingUsers}
        customer={{ name: 'Customer Name' }}
      />,
    );

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

    render(
      <PendingInvitationsBoard
        pendingUsers={[TEST_USER]}
        customer={testCustomer}
      />,
    );

    expect(
      screen.queryByText('Not currently available'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('No licences')).toBeInTheDocument();
  });

  it('Calls resendInvitation when `Resend Invitation` button is clicked', () => {
    const onResendInvitationClick = jest.fn();
    render(
      <PendingInvitationsBoard
        pendingUsers={testPendingUsers}
        customer={testCustomer}
        onResendInvitationClick={onResendInvitationClick}
      />,
    );

    const resendInvitationButton = screen.getAllByText('Resend Invitation')[0];
    expect(resendInvitationButton).toBeInTheDocument();
    userEvent.click(resendInvitationButton);
    expect(onResendInvitationClick).toHaveBeenCalledWith(testPendingUsers[0]);
  });

  it('Opens `Withdraw Invitation` dialog when button is clicked', () => {
    const onWithdrawInvitationClick = jest.fn();
    render(
      <PendingInvitationsBoard
        pendingUsers={testPendingUsers}
        customer={testCustomer}
        onWithdrawInvitationClick={onWithdrawInvitationClick}
      />,
    );

    userEvent.click(screen.getAllByTestId('options-icon')[0]);

    const optionsDropdownButton = screen.getByText('Withdraw');

    expect(optionsDropdownButton).toBeInTheDocument();
    userEvent.click(optionsDropdownButton);
    expect(onWithdrawInvitationClick).toHaveBeenCalledWith(testPendingUsers[0]);
  });
});
