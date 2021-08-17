import React, { useEffect } from 'react';

import { TableRow, SvgIcon } from '@astrosat/astrosat-ui';
import ContentWrapper from 'mission-control/content-wrapper.component';
import {
  MissionControlTable,
  MissionControlTableCell,
} from 'mission-control/shared-components/mission-control-table/mission-control-table.component';

import { ReactComponent as PdfIcon } from '../support/pdf.svg';

const getUserDocuments = () => console.log('GET USER DOCUMENTS!');

const UserDocumentRow = ({
  title = 'Document',
  date = '12-05-2020',
}) => {
  const handleIconClick = title => console.log(`${title} Document Clicked!`)
  return (
    <TableRow>
      <MissionControlTableCell>
        {title}
      </MissionControlTableCell>
      <MissionControlTableCell>
        {date}
      </MissionControlTableCell>
      <MissionControlTableCell>
      <SvgIcon>
        <PdfIcon onClick={() => handleIconClick(title)} />
      </SvgIcon>
      </MissionControlTableCell>
    </TableRow>
  )
}

const SavedDocuments = () => {
  const userDocuments = [
    {
      title: 'Test-title-1',
      date: '12-05-2020',
    },
    {
      title: 'Test-title-2',
      date: '12-06-2020',
    },
    {
      title: 'Test-title-3',
      date: '12-07-2020',
    },
  ];

  useEffect(() => {
    if (!userDocuments) {
      getUserDocuments();
    }
  });

  const columnHeaders = [
    'Name',
    'Date'
  ];

  const rows = userDocuments?.map(({title, date}) => {
    return (
      <UserDocumentRow title={title} date={date} />
    )
  });

  return (
    <ContentWrapper title='Saved Documents'>
      <MissionControlTable
        rows={rows}
        columnHeaders={columnHeaders}
        noDataMessage="No Documents"
      />
    </ContentWrapper>
  )
}

export default SavedDocuments;
