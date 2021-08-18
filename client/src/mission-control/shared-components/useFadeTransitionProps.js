import { makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  enter: {
    opacity: 0,
  },
  enterActive: {
    opacity: 1,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  exit: {
    opacity: 1,
  },
  exitActive: {
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.easeIn,
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
