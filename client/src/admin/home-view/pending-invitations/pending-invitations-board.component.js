import React from 'react';

import { format } from 'date-fns';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import ContentWrapper from '../../content-wrapper.component';

import styles from './pending-invitations.module.css';
import tableStyles from '../../table.module.css';

const DATE_FORMAT = ['k:s d MMMM yyyy'];

const PendingInvitationsBoard = ({ pendingUsers }) => (
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
            const date = format(new Date(user.invitation_date), DATE_FORMAT);
            return (
              <tr key={user.id} className={tableStyles.tr}>
                <td className={tableStyles.td}>{user.user.name}</td>
                <td className={tableStyles.td}>{user.user.email}</td>
                <td className={tableStyles.td}>{user.licences?.slice().sort().join(', ')}</td>
                <td className={tableStyles.td}>{date}</td>
                <td className={tableStyles.td}>
                  <Button className={styles.resendButton} onClick={() => console.log('CLICKED!')}>
                    Resend Invitation
                  </Button>
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

export default PendingInvitationsBoard;
