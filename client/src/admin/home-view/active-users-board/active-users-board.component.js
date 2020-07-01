import React from 'react';

import ContentWrapper from '../../content-wrapper.component';

import { getUserLicences } from '../get-user-licences-helper';

import QuickView from '../active-users-board/quick-view/quick-view.component';

import tableStyles from '../../table.module.css';

export const ActiveUsersBoard = ({ activeUsers, customer, licenceData }) => (
  <ContentWrapper title="Users">
    <QuickView licenceData={licenceData} />
    <table className={tableStyles.table}>
      <thead className={tableStyles.thead}>
        <tr className={tableStyles.tr}>
          <th align="left" className={tableStyles.th}>
            User
          </th>
          <th align="left" className={tableStyles.th}>
            Activated Licences
          </th>
          <th align="left" className={tableStyles.th}>
            Email
          </th>
        </tr>
      </thead>
      <tbody>
        {activeUsers && activeUsers.length > 0 ? (
          activeUsers.map(user => {
            const licences = getUserLicences(user, customer);
            return (
              <tr key={user.id} className={tableStyles.tr}>
                <td className={tableStyles.td}>{user.user.name}</td>
                <td className={tableStyles.td}>
                  {licences?.slice().sort().join(', ')}
                </td>
                <td className={tableStyles.td}>{user.user.email}</td>
              </tr>
            );
          })
        ) : (
          <tr className={tableStyles.tr}>
            <td align="center" colSpan={3} className={tableStyles.td}>
              No Active Users
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </ContentWrapper>
);
