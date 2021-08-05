import React, { useEffect } from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { fetchOrbs, orbsSelector } from 'data-layers/data-layers.slice';

import { OrbDetails } from './orbs/orb-details/orb-details.component';
import { Orbs } from './orbs/orbs.component';

const useStyles = makeStyles(theme => ({
  fade: {
    '&-enter': {
      opacity: 0,
      zIndex: 1,
    },
    '&-enter-active': {
      opacity: 1,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
  },
}));

/**
 * @param {{
 *  match: import('react-router-dom').match
 * location: import('history').Location
 * }} props
 * @returns
 */
export const Store = ({ match, location }) => {
  const { path } = match;
  const styles = useStyles();
  const orbs = useSelector(orbsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orbs) {
      dispatch(fetchOrbs());
    }
  }, [dispatch, orbs]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <TransitionGroup>
        <CSSTransition
          unmountOnExit
          key={location.key}
          classNames={styles.fade}
          timeout={0}
        >
          <Switch location={location}>
            <Route exact path={path} render={() => <Orbs orbs={orbs} />} />
            <Route
              exact
              path={`${path}/:orbId`}
              render={routerProps => (
                <OrbDetails orbs={orbs} {...routerProps} />
              )}
            />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};
