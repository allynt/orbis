import React from 'react';

import { TableRow } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { selectLicenceInformation } from 'mission-control/mission-control.slice';
import {
  MissionControlTable,
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
      <MissionControlTable
        columnHeaders={['Subscription', 'Purchased', 'Active', 'Available']}
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
    </ContentWrapper>
  );
};

export default () => {
  const licenceInformation = useSelector(selectLicenceInformation);
  return <Subscriptions licenceInformation={licenceInformation} />;
};
