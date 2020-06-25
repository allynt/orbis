import React from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import ContentWrapper from '../../content-wrapper.component';

import styles from './pending-invitations.module.css';
import tableStyles from '../../table.module.css';

const PendingUsersBoard = ({ pendingUsers }) => (
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
          pendingUsers.map(user => (
            <tr key={user.id} className={tableStyles.tr}>
              <td className={tableStyles.td}>{user.user.name}</td>
              <td className={tableStyles.td}>{user.user.email}</td>
              <td className={tableStyles.td}>{user.licences.map(l => `${l}, `)}</td>
              <td className={tableStyles.td}>14.34 20th April 2020</td>
              <td className={tableStyles.td}>
                <Button className={styles.resendButton} onClick={() => console.log('CLICKED!')}>
                  Resend Invitation
                </Button>
              </td>
            </tr>
          ))
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

export default PendingUsersBoard;
