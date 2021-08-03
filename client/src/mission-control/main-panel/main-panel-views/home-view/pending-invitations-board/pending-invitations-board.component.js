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
  MissionControlTable,
  MissionControlTableRow,
  MissionControlTableCell,
} from 'mission-control/mission-control-table/mission-control-table.component';

import { TablePaginationFooter } from '../../shared-components/table.pagination-footer.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { OptionsMenu } from '../options-menu.component';

const DATE_FORMAT = 'k:mm d MMMM yyyy';

const TableHeader = () => (
  <TableHead>
    <MissionControlTableRow>
      <MissionControlTableCell align="left">
        Pending Invitations
      </MissionControlTableCell>
      <MissionControlTableCell align="left">Email</MissionControlTableCell>
      <MissionControlTableCell align="left">
        Licence Type
      </MissionControlTableCell>
      <MissionControlTableCell align="left">
        Invitation Sent
      </MissionControlTableCell>
      <MissionControlTableCell align="left">Invited</MissionControlTableCell>
      <MissionControlTableCell align="left" />
    </MissionControlTableRow>
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
    <MissionControlTableRow>
      <MissionControlTableCell>
        {customerUser.user.name}
      </MissionControlTableCell>
      <MissionControlTableCell>
        {customerUser.user.email}
      </MissionControlTableCell>
      <MissionControlTableCell>
        {getLicenceInfo(licences)}
      </MissionControlTableCell>
      <MissionControlTableCell>{date}</MissionControlTableCell>
      <MissionControlTableCell>
        <Button size="small" onClick={handleResendClick}>
          Resend Invitation
        </Button>
      </MissionControlTableCell>
      <MissionControlTableCell>
        <OptionsMenu
          anchorEl={optionsAnchorEl}
          onButtonClick={handleOptionsButtonClick}
          onClose={handleOptionsMenuClose}
        >
          <MenuItem onClick={handleWithdrawClick}>Withdraw</MenuItem>
        </OptionsMenu>
      </MissionControlTableCell>
    </MissionControlTableRow>
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
  const styles = useStyles();
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

  const rows =
    pendingUsers?.length > 0 ? (
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
      <MissionControlTableRow>
        <MissionControlTableCell align="center" colSpan={5}>
          No Pending Users
        </MissionControlTableCell>
      </MissionControlTableRow>
    );

  return (
    <TableContainer className={styles.container}>
      <MissionControlTable>
        <TableHeader />
        <TableBody>{rows}</TableBody>
      </MissionControlTable>
      {Array.isArray(rows) ? (
        <TablePaginationFooter
          currentPage={currentPage + 1}
          rowsPerPage={rowsPerPage}
          pageCount={Math.ceil(rows?.length / rowsPerPage)}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          handlePrevClick={handlePrevClick}
          handleNextClick={handleNextClick}
        />
      ) : null}
    </TableContainer>
  );
};
