import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

const useStyles = makeStyles(theme => ({
  fade: {
    '&-enter': {
      opacity: 0,
    },
    '&-enter-active': {
      opacity: 1,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
    '&-exit': {
      opacity: 1,
    },
    '&-exit-active': {
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
  },
}));

export const FadeTransitionGroup = ({ children, key }) => {
  const styles = useStyles();

  return (
    <TransitionGroup style={{ position: 'relative' }}>
      <CSSTransition
        unmountOnExit
        key={key}
        classNames={styles.fade}
        timeout={250}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};
