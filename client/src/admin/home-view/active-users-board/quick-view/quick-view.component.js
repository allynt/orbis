import {
  Divider as DefaultDivider,
  makeStyles,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React from 'react';

const Wrapper = styled('div')(({ theme }) => ({
  maxWidth: theme.typography.pxToRem(700),
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr max-content 1fr max-content',
  gridTemplateRows: '1fr 1fr',
  justifyContent: 'center',
  alignItems: 'center',
  padding: `0 ${theme.spacing(5)}px`,
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

const QuickView = ({ data }) => {
  const styles = useStyles();
  return (
    <Wrapper>
      <Typography
        className={clsx(styles.active, styles.value)}
        align="center"
        component="p"
        gutterBottom
        variant="h1"
      >
        {data?.active ?? '-'}
      </Typography>
      <Typography
        className={styles.active}
        align="center"
        component="p"
        variant="h2"
      >
        Active Users
      </Typography>
      <Divider orientation="vertical" />
      <Typography
        className={clsx(styles.pending, styles.value)}
        align="center"
        component="p"
        gutterBottom
        variant="h1"
      >
        {data?.pending ?? '-'}
      </Typography>
      <Typography
        className={styles.pending}
        align="center"
        component="p"
        variant="h2"
      >
        Pending Invitations
      </Typography>
      <Divider orientation="vertical" />
      <Typography
        className={clsx(styles.available, styles.value)}
        align="center"
        component="p"
        gutterBottom
        variant="h1"
      >
        {data?.available ?? '-'}
      </Typography>
      <Typography
        className={styles.available}
        align="center"
        component="p"
        variant="h2"
      >
        Licences Available
      </Typography>
    </Wrapper>
  );
};

export default QuickView;
