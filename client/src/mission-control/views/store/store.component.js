import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { fetchOrbs, orbsSelector } from 'data-layers/data-layers.slice';
import { useFadeTransitionProps } from 'mission-control/shared-components/useFadeTransitionProps';

import { Checkout } from './checkout/checkout.component';
import { Completion } from './completion/completion.component';
import { OrbDetails } from './orbs/orb-details/orb-details.component';
import { Orbs } from './orbs/orbs.component';

/**
 * @param {{
 *  match: import('react-router-dom').match
 * location: import('history').Location
 * }} props
 * @returns
 */
export const Store = ({ match, location }) => {
  const { path } = match;
  const orbs = useSelector(orbsSelector);
  const fetchOrbsPending = useSelector(
    /**
     * @param {import('root.reducer').RootState} state
     */
    state => state?.data?.fetchOrbsPending,
  );
  const dispatch = useDispatch();
  const fadeTransitionProps = useFadeTransitionProps(location.key);

  useEffect(() => {
    if (!orbs) {
      dispatch(fetchOrbs());
    }
  }, [dispatch, orbs]);

  return (
    <TransitionGroup style={{ position: 'relative' }}>
      <CSSTransition {...fadeTransitionProps}>
        <Switch location={location}>
          <Route
            exact
            path={path}
            render={() => <Orbs orbs={orbs} isLoading={fetchOrbsPending} />}
          />
          <Route
            path={`${path}/checkout`}
            render={routerProps => (
              <Checkout
                orbs={orbs}
                onConfirmClick={stuff => console.log(stuff)}
                {...routerProps}
              />
            )}
          />
          <Route
            path={`${path}/completion`}
            render={routerProps => <Completion orbs={orbs} {...routerProps} />}
          />
          <Route
            exact
            path={`${path}/:orbId`}
            render={routerProps => <OrbDetails orbs={orbs} {...routerProps} />}
          />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};
