import React from 'react';

import {
  Divider as DefaultDivider,
  Button,
  makeStyles,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const Wrapper = styled('div')(({ theme }) => ({
  maxWidth: theme.typography.pxToRem(700),
  width: '70%',
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr max-content 1fr max-content',
  gridTemplateRows: '1fr 1fr',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(5),
}));

const Divider = styled(DefaultDivider)({
  margin: '0 auto',
  gridRow: '1 / -1',
});

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
 * }} props
 */
const QuickView = ({ data, onCreateUserClick }) => {
  const styles = useStyles();
  return (
    <Wrapper>
      <Value className={styles.active}>{data?.active ?? '-'}</Value>
      <Label className={styles.active}>Active Users</Label>
      <Divider orientation="vertical" />
      <Value className={styles.pending}>{data?.pending ?? '-'}</Value>
      <Label className={styles.pending}>Pending Invitations</Label>
      <Divider orientation="vertical" />
      <Value className={styles.available}>{data?.available ?? '-'}</Value>
      <Divider orientation="vertical" />
      <Label className={styles.available}>Licences Available</Label>
      <Button size="small" onClick={onCreateUserClick}>
        Create User
      </Button>
    </Wrapper>
  );
};

export default QuickView;
