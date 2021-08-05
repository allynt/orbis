import { makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  enter: { opacity: 0 },
  enterActive: {
    opacity: 1,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  exit: { opacity: 1 },
  exitActive: {
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

export const useFadeTransitionProps = key => {
  const classNames = useStyles();
  return {
    classNames,
    unmountOnExit: true,
    key,
    timeout: 250,
  };
};
