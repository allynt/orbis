import React from 'react';

import { Container, makeStyles, Typography } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem',
    paddingBlock: theme.spacing(2),
    paddingInline: `min(5vw, ${theme.spacing(9)})`,
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(9),
    },
    '&:not(:first-of-type)': {
      marginTop: theme.spacing(3),
    },
  },
  heading: {
    fontWeight: 600,
    fontSize: '2rem',
    width: 'fit-content',
    margin: theme.spacing(0, 'auto', 5),
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

/**
 * @param {import('@material-ui/core').ContainerProps & {title?: string}} props
 */
export const Wrapper = ({ className, children, title, ...rest }) => {
  const styles = useStyles();
  return (
    <Container className={clsx(styles.container, className)} {...rest}>
      {title && (
        <Typography variant="h1" className={styles.heading}>
          {title}
        </Typography>
      )}
      {children}
    </Container>
  );
};
