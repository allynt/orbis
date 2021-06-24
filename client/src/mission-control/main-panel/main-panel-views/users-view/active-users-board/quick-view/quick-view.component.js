import React from 'react';

import {
  Box,
  Button,
  makeStyles,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const Wrapper = styled('div')(({ theme }) => ({
  maxWidth: theme.typography.pxToRem(700),
  width: '70%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(5),
  gap: '2rem',
}));

const QuickViewItem = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: '1.5rem 0',
  backgroundColor: theme.palette.background.default,
  borderRadius: '0.25rem',
  minWidth: '14rem',
  minHeight: '8rem',
}));

const useStyles = makeStyles({
  active: {
    gridColumn: '1',
  },
  pending: {
    gridColumn: '3',
  },
  available: {
    gridColumn: '5',
  },
  value: {
    gridRow: '1',
  },
});

const Value = ({ children, className }) => {
  const styles = useStyles();
  return (
    <Typography
      className={clsx(className, styles.value)}
      children={children}
      align="center"
      component="p"
      gutterBottom
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
 *  onCreateUserClick: (type: string) => void
 * }} props
 */
const QuickView = ({ data, onCreateUserClick }) => {
  const styles = useStyles();
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
        <Button size="small" onClick={onCreateUserClick}>
          Create User
        </Button>
      </QuickViewItem>
    </Wrapper>
  );
};

export default QuickView;
