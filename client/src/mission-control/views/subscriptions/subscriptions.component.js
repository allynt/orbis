import React from 'react';

import { TableRow } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { selectLicenceInformation } from 'mission-control/mission-control.slice';
import { Heading } from 'mission-control/shared-components/heading.component';
import {
  MissionControlTable,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

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
    <Wrapper>
      <Heading>Subscriptions</Heading>
      <MissionControlTable
        columnHeaders={[
          'Orb',
          'Purchased Licences',
          'Assigned to Users',
          'Available to Assign',
        ]}
        noDataMessage="No Subscriptions Available"
        rows={
          licenceInformation &&
          Object.entries(licenceInformation).map(
            ([orb, { active, available, purchased }]) => (
              <TableRow key={`${orb}-licenses`}>
                <MissionControlTableCell>{orb}</MissionControlTableCell>
                <MissionControlTableCell>{purchased}</MissionControlTableCell>
                <MissionControlTableCell>{active}</MissionControlTableCell>
                <MissionControlTableCell>{available}</MissionControlTableCell>
              </TableRow>
            ),
          )
        }
      />
    </Wrapper>
  );
};

export default () => {
  const licenceInformation = useSelector(selectLicenceInformation);
  return <Subscriptions licenceInformation={licenceInformation} />;
};
