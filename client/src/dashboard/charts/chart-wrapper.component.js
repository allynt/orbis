import React from 'react';

import { Paper, Typography, lighten, makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { InfoButtonTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  info: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: lighten(theme.palette.background.default, 0.055),
    padding: theme.spacing(3),
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: ({ hasHeaderComponent }) =>
      hasHeaderComponent ? 'center' : 'baseline',
    marginBottom: theme.spacing(2),
  },
}));

/**
 * @param {{
 * children: React.ReactNode
 * title: string
 * titleSize?: string
 * info?: string
 * headerComponent?: any
 * classes?: object
 * }} props
 */
const ChartWrapper = ({
  children,
  title,
  titleSize = 'medium',
  info,
  headerComponent,
  classes = {},
  ...rest
}) => {
  const hasHeaderComponent = !!headerComponent;
  const styles = useStyles({ hasHeaderComponent });
  const { header } = classes;
  return (
    <Paper className={styles.paper} {...rest}>
      <div className={clsx(styles.header, header)}>
        <Typography
          component="h3"
          variant={titleSize === 'small' ? 'h4' : 'h2'}
          color="primary"
        >
          {title}
        </Typography>
        {!!headerComponent ? headerComponent : null}
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

export { ChartWrapper };
