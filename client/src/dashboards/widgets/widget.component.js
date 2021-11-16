import React from 'react';

import { Paper, Typography, lighten, makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { InfoButtonTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  info: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    backgroundColor: lighten(theme.palette.background.default, 0.055),
    padding: theme.spacing(3),
    height: 'fit-content',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
}));

/**
 * @param {{
 * children: React.ReactNode
 * title: string
 * titleSize?: string
 * info?: string
 * className?: string
 * }} props
 */
const Widget = ({
  children,
  title,
  titleSize = 'medium',
  info,
  className,
  ...rest
}) => {
  const styles = useStyles({});

  // TODO: title width affects size of child component

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
          <InfoButtonTooltip
            tooltipContent={info}
            iconButtonClassName={styles.info}
          />
        ) : null}
      </div>
      {children}
    </Paper>
  );
};

export { Widget };
