import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';

import { selectLicenceInformation } from 'mission-control/mission-control.slice';
import { Table } from 'components/table';
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
  const columns = useMemo(
    () => [
      {
        Header: 'Orb',
        accessor: 'orb',
      },
      { Header: 'Purchased Licences', accessor: 'purchased' },
      { Header: 'Assigned to Users', accessor: 'active' },
      { Header: 'Available to Assign', accessor: 'available' },
    ],
    [],
  );
  const data = useMemo(
    () =>
      licenceInformation && Object.keys(licenceInformation).length > 0
        ? Object.entries(licenceInformation).map(([orb, values]) => ({
            orb,
            ...values,
          }))
        : [],
    [licenceInformation],
  );

  return (
    <Wrapper title="Subscriptions">
      <Table
        columns={columns}
        data={data}
        noDataMessage="No Subscriptions Available"
        getHeaderProps={column => ({
          align: column.id !== 'orb' ? 'right' : 'left',
        })}
        getCellProps={cell => ({
          align: cell.column.id !== 'orb' ? 'right' : 'left',
        })}
      />
    </Wrapper>
  );
};

export default () => {
  const licenceInformation = useSelector(selectLicenceInformation);
  return <Subscriptions licenceInformation={licenceInformation} />;
};
