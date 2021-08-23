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

/**
 *
 * @param {{
 *  documents: {
 *    id: string,
 *    title: string,
 *    date: string,
 *    url: string
 *  }[]
 * }} props
 */
const SavedDocuments = ({ documents }) => {
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
          {documents?.map(({ id, title, date }) => (
            <TableRow key={id}>
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
