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
    <ContentWrapper title="Licence Dashboard">
      <TableContainer>
        <MissionControlTable>
          <TableHead>
            <MissionControlTableRow>
              <MissionControlTableCell />
              <MissionControlTableCell align="center">
                Purchased Licences
              </MissionControlTableCell>
              <MissionControlTableCell align="center">
                Active Licences
              </MissionControlTableCell>
              <MissionControlTableCell align="center">
                Available Licences
              </MissionControlTableCell>
            </MissionControlTableRow>
          </TableHead>
          <TableBody>
            {licenceInformation && Object.keys(licenceInformation).length ? (
              Object.keys(licenceInformation).map(orb => (
                <TableRow key={`${orb}-licenses`}>
                  <MissionControlTableCell>{orb}</MissionControlTableCell>
                  <MissionControlTableCell align="center">
                    {licenceInformation[orb].purchased}
                  </MissionControlTableCell>
                  <MissionControlTableCell align="center">
                    {licenceInformation[orb].active}
                  </MissionControlTableCell>
                  <MissionControlTableCell align="center">
                    {licenceInformation[orb].available}
                  </MissionControlTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <MissionControlTableCell align="center" colSpan={4}>
                  No Licences Available
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
