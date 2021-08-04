import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { fetchOrbs, orbsSelector } from 'data-layers/data-layers.slice';

import { OrbDetails } from './orbs/orb-details/orb-details.component';
import { Orbs } from './orbs/orbs.component';

export const Store = () => {
  const orbs = useSelector(orbsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orbs) {
      dispatch(fetchOrbs());
    }
  }, [dispatch, orbs]);

  return (
    <Switch>
      <Route
        exact
        path="/mission-control/store/orbs"
        render={() => <Orbs orbs={orbs} />}
      />
      <Route
        path="/mission-control/store/orbs/:id"
        exact
        render={() => <OrbDetails orbs={orbs} />}
      />
      <Route exact path="/mission-control/store">
        <Redirect to="/mission-control/store/orbs" />
      </Route>
    </Switch>
  );
};
