import React from 'react';
import tableStyles from '../table.module.css';

export const ActiveUsersBoard = ({ activeUsers }) => (
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
      {activeUsers && activeUsers.length ? (
        activeUsers.map(user => (
          <tr className={tableStyles.tr}>
            <td className={tableStyles.td}>{user.name}</td>
            <td className={tableStyles.td}>{user.licences?.sort().join(', ')}</td>
            <td className={tableStyles.td}>{user.email}</td>
          </tr>
        ))
      ) : (
        <tr className={tableStyles.tr}>
          <td align="center" colSpan={3} className={tableStyles.td}>
            No Active Users
          </td>
        </tr>
      )}
    </tbody>
  </table>
);
