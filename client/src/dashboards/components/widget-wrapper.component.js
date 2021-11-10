import React from 'react';

import { Paper, Typography, lighten, makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { InfoButtonTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  info: {
    marginLeft: theme.spacing(1),
  },
  paper: {
    backgroundColor: lighten(theme.palette.background.default, 0.055),
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
}));

const Widget = ({
  children,
  title,
  titleSize = 'medium',
  info,
  className,
  ...rest
}) => {
  const styles = useStyles({});
  return (
    <Paper className={clsx(styles.paper, className)} {...rest}>
      <div className={styles.header}>
        <Typography
          component="h3"
          variant={titleSize === 'small' ? 'h4' : 'h2'}
          color="primary"
        >
          {title}
        </Typography>
        {!!info ? (
          <InfoButtonTooltip tooltipContent={info} className={styles.info} />
        ) : null}
      </div>
      {children}
    </Paper>
  );
};

export default Widget;
