import React from 'react';

import { makeStyles, styled, Typography, Button } from '@astrosat/astrosat-ui';

import { ReactComponent as CreateUserIcon } from './create-user.svg';

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'stretch',
  marginBottom: theme.spacing(3.75),
}));

const QuickViewItem = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  borderRadius: '0.25rem',
  minWidth: '14rem',
  minHeight: '8rem',
  margin: theme.spacing(0, 1.25, 1.25, 1.25),
}));

const useStyles = makeStyles(theme => ({
  value: {
    fontWeight: 400,
    fontSize: '2.25rem',
    marginBottom: theme.spacing(1.5),
  },
  createUserIcon: {
    color: theme.palette.common.white,
    height: theme.typography.pxToRem(40),
    width: theme.typography.pxToRem(40),
    marginBottom: theme.spacing(1.5),
  },
}));

const Value = ({ children }) => {
  const styles = useStyles();
  return (
    <Typography
      className={styles.value}
      children={children}
      align="center"
      component="p"
      variant="h1"
    />
  );
};

const Label = ({ children }) => (
  <Typography
    children={children}
    align="center"
    component="p"
    variant="h2"
  />
);

/**
 * @typedef QuickViewData
 * @property {number} [active]
 * @property {number} [pending]
 * @property {number} [available]
 */

/**
 * @param {{
 *  data?: QuickViewData
 *  onCreateUserClick?: (customerUser: import('typings/orbis').CustomerUser) => void
 * }} props
 */
const QuickView = ({ data, onCreateUserClick }) => {
  const styles = useStyles({});
  return (
    <Wrapper>
      <QuickViewItem>
        <Value>{data?.active ?? '-'}</Value>
        <Label>Active Users</Label>
      </QuickViewItem>

      <QuickViewItem>
        <Value>{data?.pending ?? '-'}</Value>
        <Label>Pending Invitations</Label>
      </QuickViewItem>

      <QuickViewItem>
        <Value>{data?.available ?? '-'}</Value>
        <Label>Licences Available</Label>
      </QuickViewItem>

      <QuickViewItem>
        <CreateUserIcon className={styles.createUserIcon} />
        <Button size="small" onClick={onCreateUserClick}>
          Create User
        </Button>
      </QuickViewItem>
    </Wrapper>
  );
};

export default QuickView;
