import React, { useEffect, useState } from 'react';

import {
  TableRow,
  SvgIcon,
  makeStyles,
  Link,
  TableSortLabel,
} from '@astrosat/astrosat-ui';

import { ArrowDropDown } from '@material-ui/icons';
import { useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';
import {
  MissionControlTable,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { ReactComponent as PdfIcon } from '../support/pdf.svg';

const useStyles = makeStyles(() => ({
  icon: {
    cursor: 'pointer',
  },
}));

const UserDocumentRow = ({ title, date, url }) => {
  const styles = useStyles({});
  return (
    <TableRow>
      <MissionControlTableCell>{title}</MissionControlTableCell>
      <MissionControlTableCell>{date}</MissionControlTableCell>
      <MissionControlTableCell>
        <Link href={url} rel="noopener noreferrer" target="_blank">
          <SvgIcon className={styles.icon}>
            <PdfIcon />
          </SvgIcon>
        </Link>
      </MissionControlTableCell>
    </TableRow>
  );
};

export const TEST_DOCUMENTS = [
  {
    title: 'Test-title-1',
    date: '02-05-2020',
  },
  {
    title: 'Test-title-2',
    date: '01-05-2020',
  },
  {
    title: 'Test-title-3',
    date: '03-05-2020',
  },
  {
    title: 'Test-title-4',
    date: '04-05-2020',
  },
  {
    title: 'Test-title-10',
    date: '05-05-2020',
  },
  {
    title: 'Test-title-5',
    date: '06-05-2020',
  },
  {
    title: 'Test-title-6',
    date: '07-05-2020',
  },
  {
    title: 'Test-title-7',
    date: '08-05-2020',
  },
  {
    title: 'Test-title-8',
    date: '09-05-2020',
  },
  {
    title: 'Test-title-9',
    date: '10-05-2020',
  },
];

const SavedDocuments = ({ documents = TEST_DOCUMENTS }) => {
  const user = useSelector(userSelector);
  const [sortProperty, setSetProperty] = useState('date');

  const columnHeaders = ['Name', 'Date'].map(column => (
    <MissionControlTableCell sortDirection="desc" key={column} align="left">
      <TableSortLabel
        active={sortProperty === column.toLowerCase()}
        direction="desc"
        onClick={() => setSetProperty(column.toLowerCase())}
        IconComponent={ArrowDropDown}
      >
        {column}
      </TableSortLabel>
    </MissionControlTableCell>
  ));

  const url = apiClient.documents.userGuideUrl();

  // useEffect(() => {
  //   if (!!documents || !user) return;

  //   const url = `http://www.localhost:8000/api/mission-control/saved-documents/${user.id}`;

  //   (() => {
  //     fetch(url, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //       .then(data => data.json())
  //       .then(docs => setDocuments(docs));
  //   })();
  // }, [documents, user]);

  const sortHandler = (a, b) => {
    return a[sortProperty] > b[sortProperty]
      ? 1
      : a[sortProperty] < b[sortProperty]
      ? -1
      : 0;
  };

  const rows = [...documents]?.sort(sortHandler).map(({ title, date }) => {
    return <UserDocumentRow title={title} date={date} url={url} />;
  });

  return (
    <Wrapper title="Saved Documents">
      <MissionControlTable
        rows={rows}
        columnHeaders={columnHeaders}
        noDataMessage="No Documents"
      />
    </Wrapper>
  );
};

export default SavedDocuments;
