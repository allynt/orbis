import React from 'react';

import {
  makeStyles,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { selectLicenceInformation } from 'mission-control/mission-control.slice';
import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
}));

/**
 *
 * @param {{
 *  licenceInformation: {
 *    [key: string]: {
 *      purchased: number,
 *      active: number,
 *      available: number,
 *      pending: number
 *    }
 *  }
 * }} props
 */
export const Subscriptions = ({ licenceInformation }) => {
  const styles = useStyles();
  return (
    <Wrapper title="Subscriptions">
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <MissionControlTableCell>Orb</MissionControlTableCell>
            <MissionControlTableCell align="right">
              Purchased Licences
            </MissionControlTableCell>
            <MissionControlTableCell align="right">
              Assigned to Users
            </MissionControlTableCell>
            <MissionControlTableCell align="right">
              Available to Assign
            </MissionControlTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {licenceInformation && Object.keys(licenceInformation).length > 0 ? (
            Object.entries(licenceInformation).map(
              ([orb, { active, available, purchased }]) => (
                <TableRow key={`${orb}-licenses`}>
                  <MissionControlTableCell>{orb}</MissionControlTableCell>
                  <MissionControlTableCell align="right">
                    {purchased}
                  </MissionControlTableCell>
                  <MissionControlTableCell align="right">
                    {active}
                  </MissionControlTableCell>
                  <MissionControlTableCell align="right">
                    {available}
                  </MissionControlTableCell>
                </TableRow>
              ),
            )
          ) : (
            <TableRow>
              <MissionControlTableCell colspan={4} align="center">
                No Subscriptions Available
              </MissionControlTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Wrapper>
  );
};

export default () => {
  const licenceInformation = useSelector(selectLicenceInformation);
  return <Subscriptions licenceInformation={licenceInformation} />;
};
