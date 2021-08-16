import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customer, pendingUsers } from 'mission-control/test-story-data';

import { PendingInvitationsBoard } from './pending-invitations-board.component';

describe('PendingUsersBoard', () => {
  const cases = [
    ['names', 'name'],
    ["email address'", 'email'],
  ];
  const onWithdrawInvitationClick = jest.fn();
  const onResendInvitationClick = jest.fn();
  it.each(cases)("Displays all pending user's %s", (_, text) => {
    const { getByText } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
      />,
    );
    pendingUsers.forEach(user =>
      expect(getByText(user.user[text])).toBeInTheDocument(),
    );
  });

  it('Displays user Orb licence names', () => {
    const { getAllByText } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
      />,
    );

    expect(getAllByText('Oil, Rice')[0]).toBeInTheDocument();
  });

  it('Displays a placeholder if no customer is present', () => {
    const { getAllByText } = render(
      <PendingInvitationsBoard pendingUsers={pendingUsers} customer={null} />,
    );

    pendingUsers.forEach((user, i) =>
      expect(getAllByText('Not currently available')[i]).toBeInTheDocument(),
    );
  });

  it('Displays a placeholder when customer is present but has no licences', () => {
    const { getAllByText, queryByText } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={{ name: 'Customer Name' }}
      />,
    );

    expect(queryByText('No licences')).not.toBeInTheDocument();

    pendingUsers.forEach((user, i) =>
      expect(getAllByText('Not currently available')[i]).toBeInTheDocument(),
    );
  });

  it('Displays a placeholder when user has no licences', () => {
    const TEST_USER = {
      ...pendingUsers[0],
      id: '99',
    };

    const { getByText, queryByText } = render(
      <PendingInvitationsBoard
        pendingUsers={[TEST_USER]}
        customer={customer}
      />,
    );

    expect(queryByText('Not currently available')).not.toBeInTheDocument();
    expect(getByText('No licences')).toBeInTheDocument();
  });

  it('Calls resendInvitation when `Resend Invitation` button is clicked', () => {
    const { getAllByText } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
        onResendInvitationClick={onResendInvitationClick}
      />,
    );

    const resendInvitationButton = getAllByText('Resend Invitation')[0];
    expect(resendInvitationButton).toBeInTheDocument();
    userEvent.click(resendInvitationButton);
    expect(onResendInvitationClick).toHaveBeenCalledWith(pendingUsers[0]);
  });

  it('Opens `Withdraw Invitation` dialog when button is clicked', () => {
    const { getByText, getAllByTestId } = render(
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
        onWithdrawInvitationClick={onWithdrawInvitationClick}
      />,
    );

    userEvent.click(getAllByTestId('options-icon')[0]);

    const optionsDropdownButton = getByText('Withdraw');

    expect(optionsDropdownButton).toBeInTheDocument();
    userEvent.click(optionsDropdownButton);
    expect(onWithdrawInvitationClick).toHaveBeenCalledWith(pendingUsers[0]);
  });
});
