import React from 'react';

import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { AdminTableCell } from 'admin/admin-table/admin-table-cell.component';
import ContentWrapper from 'admin/content-wrapper.component';

const useStyles = makeStyles(theme => ({
  container: {
    maxHeight: `calc(100% - ${theme.typography.pxToRem(theme.spacing(10))})`,
  },
}));

/**
 * @param {{licenceInformation: {
 *            [key: string]: {
 *              purchased: number,
 *              active: number,
 *              available: number,
 *              pending: number
 *            }
 *          }}} props
 */
export const LicenceDashboard = ({ licenceInformation }) => {
  const styles = useStyles();
  return (
    <ContentWrapper title="Licence Dashboard" fullHeight>
      <TableContainer className={styles.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <AdminTableCell />
              <AdminTableCell align="center">Purchased Licences</AdminTableCell>
              <AdminTableCell align="center">Active Licences</AdminTableCell>
              <AdminTableCell align="center">Available Licences</AdminTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {licenceInformation && Object.keys(licenceInformation).length ? (
              Object.keys(licenceInformation).map(orb => (
                <TableRow key={`${orb}-licenses`}>
                  <AdminTableCell>{orb}</AdminTableCell>
                  <AdminTableCell align="center">
                    {licenceInformation[orb].purchased}
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    {licenceInformation[orb].active}
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    {licenceInformation[orb].available}
                  </AdminTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <AdminTableCell align="center" colSpan={4}>
                  No Licences Available
                </AdminTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ContentWrapper>
  );
};
