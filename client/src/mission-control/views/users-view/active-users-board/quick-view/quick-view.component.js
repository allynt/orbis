import React from 'react';

import { makeStyles, styled, Typography, Button } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { ReactComponent as CreateUserIcon } from './create-user.svg';

const Wrapper = styled('div')(({ theme }) => ({
  width: '70%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'stretch',
  marginBottom: theme.spacing(5),
  gap: '2rem',
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
}));

const useStyles = makeStyles(theme => ({
  active: {
    gridColumn: '1',
    '&:first-of-type': {
      fontSize: '2.25rem',
      marginBottom: theme.spacing(1.5),
    },
  },
  pending: {
    gridColumn: '3',
    '&:first-of-type': {
      fontSize: '2.25rem',
      marginBottom: theme.spacing(1.5),
    },
  },
  available: {
    gridColumn: '5',
    '&:first-of-type': {
      fontSize: '2.25rem',
      marginBottom: theme.spacing(1.5),
    },
  },
  value: {
    gridRow: '1',
    fontWeight: 'normal',
    '&:first-of-type': {
      marginBottom: theme.spacing(1.5),
    },
  },
  createUserIcon: {
    color: theme.palette.common.white,
    height: theme.typography.pxToRem(40),
    width: theme.typography.pxToRem(40),
    '&:first-of-type': {
      marginBottom: theme.spacing(1.5),
    },
  },
}));

const Value = ({ children, className }) => {
  const styles = useStyles();
  return (
    <Typography
      className={clsx(className, styles.value)}
      children={children}
      align="center"
      component="p"
      variant="h1"
    />
  );
};

const Label = ({ children, className }) => (
  <Typography
    children={children}
    className={className}
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
        <Value className={styles.active}>{data?.active ?? '-'}</Value>
        <Label className={styles.active}>Active Users</Label>
      </QuickViewItem>

      <QuickViewItem>
        <Value className={styles.pending}>{data?.pending ?? '-'}</Value>
        <Label className={styles.pending}>Pending Invitations</Label>
      </QuickViewItem>

      <QuickViewItem>
        <Value className={styles.available}>{data?.available ?? '-'}</Value>
        <Label className={styles.available}>Licences Available</Label>
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
