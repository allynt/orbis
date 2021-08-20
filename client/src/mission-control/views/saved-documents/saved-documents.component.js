import React, { useEffect, useState } from 'react';

import { TableRow, SvgIcon, makeStyles } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { SubClient } from 'api-client/SubClient'

import { userSelector } from 'accounts/accounts.selectors';
import ContentWrapper from 'mission-control/content-wrapper.component';
import {
  MissionControlTable,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import { ReactComponent as PdfIcon } from '../support/pdf.svg';
import { TEST_DOCUMENTS } from './saved-documents.test';

const useStyles = makeStyles(() => ({
  icon: {
    cursor: 'pointer',
  },
}));

const UserDocumentRow = ({ title = 'Document', date = '12-05-2020' }) => {
  const styles = useStyles({});
  const handleIconClick = title => console.log(`${title} clicked.`);
  return (
    <TableRow>
      <MissionControlTableCell>{title}</MissionControlTableCell>
      <MissionControlTableCell>{date}</MissionControlTableCell>
      <MissionControlTableCell>
        <SvgIcon className={styles.icon} onClick={() => handleIconClick(title)}>
          <PdfIcon />
        </SvgIcon>
      </MissionControlTableCell>
    </TableRow>
  );
};

const SavedDocuments = () => {
  const user = useSelector(userSelector);
  const [documents, setDocuments] = useState(TEST_DOCUMENTS);

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

  const columnHeaders = ['Name', 'Date'];

  const rows = documents?.map(({ title, date }) => {
    return <UserDocumentRow title={title} date={date} />;
  });

  return (
    <ContentWrapper title="Saved Documents">
      <MissionControlTable
        rows={rows}
        columnHeaders={columnHeaders}
        noDataMessage="No Documents"
      />
    </ContentWrapper>
  );
};

export default SavedDocuments;
