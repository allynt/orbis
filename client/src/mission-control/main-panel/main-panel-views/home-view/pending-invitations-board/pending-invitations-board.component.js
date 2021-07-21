import React, { useState } from 'react';

import {
  Button,
  makeStyles,
  MenuItem,
  TableBody,
  TableContainer,
  TableHead,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import {
  UsersViewTable,
  UsersViewTableRow,
  UsersViewTableCell,
} from 'mission-control/mission-control-table/mission-control-table.component';

import { TablePaginationFooter } from '../../shared-components/table.pagination-footer.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const TableHeader = () => (
  <TableHead>
    <UsersViewTableRow>
      <UsersViewTableCell align="left">Pending Invitations</UsersViewTableCell>
      <UsersViewTableCell align="left">Email</UsersViewTableCell>
      <UsersViewTableCell align="left">Licence Type</UsersViewTableCell>
      <UsersViewTableCell align="left">Invitation Sent</UsersViewTableCell>
      <UsersViewTableCell align="left">Invited</UsersViewTableCell>
      <UsersViewTableCell align="left" />
    </UsersViewTableRow>
  </TableHead>
);

/**
 * @param {{
 *   customerUser?: import('typings/orbis').CustomerUser
 *   customer?: import('typings/orbis').Customer
 *   onResendInvitationClick?: () => void
 *   onWithdrawInvitationClick?: () => void
 * }} props
 */
const PendingUserRow = ({
  customerUser,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);
  const date = format(new Date(customerUser.invitation_date), DATE_FORMAT);
  let licences = null;
  if (customer && customer.licences) {
    licences = getUserLicences(customerUser, customer);
  }

  const handleResendClick = () => {
    onResendInvitationClick();
  };

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
   */
  const handleOptionsButtonClick = e => {
    setOptionsAnchorEl(e.currentTarget);
  };

  const handleOptionsMenuClose = () => {
    setOptionsAnchorEl(null);
  };

  const handleWithdrawClick = () => {
    onWithdrawInvitationClick();
    setOptionsAnchorEl(null);
  };

  return (
    <UsersViewTableRow>
      <UsersViewTableCell>{customerUser.user.name}</UsersViewTableCell>
      <UsersViewTableCell>{customerUser.user.email}</UsersViewTableCell>
      <UsersViewTableCell>{getLicenceInfo(licences)}</UsersViewTableCell>
      <UsersViewTableCell>{date}</UsersViewTableCell>
      <UsersViewTableCell>
        <Button size="small" onClick={handleResendClick}>
          Resend Invitation
        </Button>
      </UsersViewTableCell>
      <UsersViewTableCell>
        <OptionsMenu
          anchorEl={optionsAnchorEl}
          onButtonClick={handleOptionsButtonClick}
          onClose={handleOptionsMenuClose}
        >
          <MenuItem onClick={handleWithdrawClick}>Withdraw</MenuItem>
        </OptionsMenu>
      </UsersViewTableCell>
    </UsersViewTableRow>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    maxHeight: `calc(100% - ${theme.spacing(10)})`,
  },
}));

/**
 * @param {{
 *   pendingUsers?: import('typings/orbis').CustomerUser[]
 *   customer?: import('typings/orbis').Customer
 *   onResendInvitationClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 *   onWithdrawInvitationClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 * }} props
 */
export const PendingInvitationsBoard = ({
  pendingUsers,
  customer,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => {
    setCurrentPage(newPage - 1);
  };

  const handleChangeRowsPerPage = value => {
    setRowsPerPage(parseInt(value, 10));
    setCurrentPage(0);
  };

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const styles = useStyles();

  const rows =
    pendingUsers.length > 0 ? (
      pendingUsers.map(user => (
        <PendingUserRow
          key={user.id}
          customerUser={user}
          customer={customer}
          onResendInvitationClick={() => onResendInvitationClick(user)}
          onWithdrawInvitationClick={() => onWithdrawInvitationClick(user)}
        />
      ))
    ) : (
      <UsersViewTableRow>
        <UsersViewTableCell align="center" colSpan={5}>
          No Pending Users
        </UsersViewTableCell>
      </UsersViewTableRow>
    );

  const pageCount = Math.ceil(rows?.length / rowsPerPage);

  return (
    <TableContainer className={styles.container}>
      <UsersViewTable>
        <TableHeader />
        <TableBody>{rows}</TableBody>
      </UsersViewTable>
      {Array.isArray(rows) ? (
        <TablePaginationFooter
          currentPage={currentPage + 1}
          rowsPerPage={rowsPerPage}
          pageCount={pageCount}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          handlePrevClick={handlePrevClick}
          handleNextClick={handleNextClick}
        />
      ) : null}
    </TableContainer>
  );
};
