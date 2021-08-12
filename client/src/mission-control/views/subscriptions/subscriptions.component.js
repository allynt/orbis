import React from 'react';

import {
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { selectLicenceInformation } from 'mission-control/mission-control.slice';
import {
  MissionControlTable,
  MissionControlTableRow,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import ContentWrapper from '../../content-wrapper.component';

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
  return (
    <ContentWrapper title="Subscriptions">
      <TableContainer>
        <MissionControlTable>
          <TableHead>
            <MissionControlTableRow>
              <MissionControlTableCell>Subscription</MissionControlTableCell>
              <MissionControlTableCell>Purchased</MissionControlTableCell>
              <MissionControlTableCell>Active</MissionControlTableCell>
              <MissionControlTableCell>Available</MissionControlTableCell>
            </MissionControlTableRow>
          </TableHead>
          <TableBody>
            {licenceInformation && Object.keys(licenceInformation).length ? (
              Object.keys(licenceInformation).map(orb => (
                <TableRow key={`${orb}-licenses`}>
                  <MissionControlTableCell>{orb}</MissionControlTableCell>
                  <MissionControlTableCell>
                    {licenceInformation[orb].purchased}
                  </MissionControlTableCell>
                  <MissionControlTableCell>
                    {licenceInformation[orb].active}
                  </MissionControlTableCell>
                  <MissionControlTableCell>
                    {licenceInformation[orb].available}
                  </MissionControlTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <MissionControlTableCell align="center" colSpan={4}>
                  No Subscriptions Available
                </MissionControlTableCell>
              </TableRow>
            )}
          </TableBody>
        </MissionControlTable>
      </TableContainer>
    </ContentWrapper>
  );
};

export default () => {
  const licenceInformation = useSelector(selectLicenceInformation);
  return <Subscriptions licenceInformation={licenceInformation} />;
};
