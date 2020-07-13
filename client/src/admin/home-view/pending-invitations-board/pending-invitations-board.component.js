import React, { useState } from 'react';

import { format } from 'date-fns';

import { OptionsIcon } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { getUserLicences } from '../get-user-licences-helper';

import tableStyles from '../../table.module.css';

const DATE_FORMAT = ['k:s d MMMM yyyy'];

export const PendingInvitationsBoard = ({
  pendingUsers,
  customer,
  onWithdrawInvitationClick,
}) => {
  const [userOptions, setUserOptions] = useState(null);

  return (
    <ContentWrapper title="Pending Invitations">
      <table className={tableStyles.table}>
        <thead className={tableStyles.thead}>
          <tr className={tableStyles.tr}>
            <th align="left" className={tableStyles.th}>
              Pending Invitations
            </th>
            <th align="left" className={tableStyles.th}>
              Email
            </th>
            <th align="left" className={tableStyles.th}>
              Licence Type
            </th>
            <th align="left" className={tableStyles.th}>
              Invitation Sent
            </th>
            <th align="left" className={tableStyles.th}>
              Invited
            </th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers && pendingUsers.length > 0 ? (
            pendingUsers.map(user => {
              const selected = userOptions === user;
              const date = format(new Date(user.invitation_date), DATE_FORMAT);
              let licences = null;
              if (customer && customer.licences) {
                licences = getUserLicences(user, customer);
              }
              return (
                <tr key={user.id} className={tableStyles.tr}>
                  <td className={tableStyles.td}>{user.user.name}</td>
                  <td className={tableStyles.td}>{user.user.email}</td>
                  <td className={tableStyles.td}>
                    {licences
                      ? licences.slice().sort().join(', ')
                      : 'Not currently available'}
                  </td>
                  <td className={tableStyles.td}>{date}</td>
                  <td
                    className={`${tableStyles.td} ${tableStyles.optionsColumn}`}
                  >
                    <OptionsIcon
                      classes={`${tableStyles.optionsIcon} ${
                        selected && tableStyles.optionsIconSelected
                      }`}
                      onClick={() => setUserOptions(selected ? null : user)}
                    />
                    {selected && (
                      <div
                        className={tableStyles.optionsDropdown}
                        onClick={() => {
                          onWithdrawInvitationClick(user);
                          setUserOptions(null);
                        }}
                      >
                        <p className={tableStyles.optionsText}>
                          Withdraw Invitation
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className={tableStyles.tr}>
              <td align="center" colSpan={3} className={tableStyles.td}>
                No Pending Users
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </ContentWrapper>
  );
};
