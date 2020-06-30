import React, { useMemo } from 'react';
import tableStyles from '../table.module.css';
import { createLicenceInformation } from './create-licence-information';

/**
 * @param {{licences: {id: string, orb: string, customer_user?: string}[]}} props
 */
export const LicenceDashboard = ({ licences }) => {
  const licenceInformation = useMemo(() => createLicenceInformation(licences), [licences]);

  return (
    <table className={tableStyles.table}>
      <thead className={tableStyles.thead}>
        <tr className={tableStyles.tr}>
          <th className={tableStyles.th} />
          <th className={tableStyles.th}>Purchased Licences</th>
          <th className={tableStyles.th}>Active Licences</th>
          <th className={tableStyles.th}>Available Licences</th>
        </tr>
      </thead>
      <tbody className={tableStyles.tbody}>
        {licences && licences.length ? (
          Object.keys(licenceInformation).map(orb => (
            <tr className={tableStyles.tr}>
              <td className={tableStyles.td}>{orb}</td>
              <td align="center" className={tableStyles.td}>
                {licenceInformation[orb].purchased}
              </td>
              <td align="center" className={tableStyles.td}>
                {licenceInformation[orb].active}
              </td>
              <td align="center" className={tableStyles.td}>
                {licenceInformation[orb].available}
              </td>
            </tr>
          ))
        ) : (
          <tr className={tableStyles.tr}>
            <td className={tableStyles.td} align="center" colSpan={4}>
              No Licences Available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
