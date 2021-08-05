import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { fetchOrbs, orbsSelector } from 'data-layers/data-layers.slice';
import { FadeTransitionGroup } from 'mission-control/fade-transition-group.component';

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
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orbs) {
      dispatch(fetchOrbs());
    }
  }, [dispatch, orbs]);

  return (
    <FadeTransitionGroup key={location.key}>
      <Switch location={location}>
        <Route exact path={path} render={() => <Orbs orbs={orbs} />} />
        <Route
          exact
          path={`${path}/:orbId`}
          render={routerProps => <OrbDetails orbs={orbs} {...routerProps} />}
        />
      </Switch>
    </FadeTransitionGroup>
  );
};
