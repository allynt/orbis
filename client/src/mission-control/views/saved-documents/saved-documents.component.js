import React, { useEffect, useState } from 'react';

import { TableRow, SvgIcon, makeStyles, Link } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';
import apiClient from 'api-client';
import {
  MissionControlTable,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { ReactComponent as PdfIcon } from '../support/pdf.svg';
import { TEST_DOCUMENTS } from './saved-documents.test';

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

const SavedDocuments = () => {
  const user = useSelector(userSelector);
  const [documents, setDocuments] = useState(TEST_DOCUMENTS);

  const columnHeaders = ['Name', 'Date'].map(column => (
    <MissionControlTableCell key={column} align="left">
      {column}
    </MissionControlTableCell>
  ));

  const url = apiClient.documents.userGuideUrl();

  useEffect(() => {
    if (!!documents || !user) return;

    const url = `http://www.localhost:8000/api/mission-control/saved-documents/${user.id}`;

    (() => {
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(data => data.json())
        .then(docs => setDocuments(docs));
    })();
  }, [documents, user]);

  const rows = documents?.map(({ title, date }) => {
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
