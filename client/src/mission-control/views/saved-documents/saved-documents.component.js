import React from 'react';

import {
  IconButton,
  makeStyles,
  SvgIcon,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@astrosat/astrosat-ui';

import { MissionControlTableCell } from 'mission-control/shared-components/mission-control-table/mission-control-table.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { ReactComponent as PdfIcon } from '../support/pdf.svg';

const useStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
  icon: {
    cursor: 'pointer',
  },
}));

export const TEST_DOCUMENTS = [
  {
    title: 'Test-title-3',
    date: '02-05-2020',
  },
  {
    title: 'Test-title-2',
    date: '01-05-2020',
  },
  {
    title: 'Test-title-1',
    date: '03-05-2020',
  },
];

const SavedDocuments = ({ documents = TEST_DOCUMENTS }) => {
  const styles = useStyles({});
  return (
    <Wrapper title="Saved Documents">
      <Table className={styles.table}>
        <TableHead>
          <MissionControlTableCell>Name</MissionControlTableCell>
          <MissionControlTableCell>Data</MissionControlTableCell>
          <MissionControlTableCell />
        </TableHead>
        <TableBody>
          {documents.map(({ title, date }) => (
            <TableRow key={`${title}-${date}`}>
              <MissionControlTableCell>{title}</MissionControlTableCell>
              <MissionControlTableCell>{date}</MissionControlTableCell>
              <MissionControlTableCell padding="checkbox">
                <IconButton>
                  <SvgIcon className={styles.icon}>
                    <PdfIcon />
                  </SvgIcon>
                </IconButton>
              </MissionControlTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Wrapper>
  );
};

export default SavedDocuments;
