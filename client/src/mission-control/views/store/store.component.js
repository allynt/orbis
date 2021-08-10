import React, { useEffect } from 'react';

import { push } from 'connected-react-router';
import { find } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { placeOrder } from 'accounts/accounts.slice';
import { fetchOrbs, orbsSelector } from 'data-layers/data-layers.slice';
import { useFadeTransitionProps } from 'mission-control/shared-components/useFadeTransitionProps';

import { Checkout } from './checkout/checkout.component';
import { Completion } from './completion/completion.component';
import { OrbDetails } from './orb-details/orb-details.component';
import { Orbs } from './orbs/orbs.component';

/**
 * @param {{
 *  match: import('react-router-dom').match
 *  location: import('history').Location
 * }} props
 * @returns
 */
export const Store = ({ match, location }) => {
  const { path, url } = match;
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

  /**
   * @param {{
   * orbId: number;
   * users: number;
   *}} param0
   */
  const handleConfirmClick = async ({ orbId, users }) => {
    const orb = find(orbs, { id: orbId });
    try {
      await dispatch(
        placeOrder({
          licences: users,
          subscription: orb.name,
          paymentType: 'standard',
        }),
      );
      dispatch(push(`${url}/completion/?orbId=${orbId}&users=${users}`));
    } catch (error) {
      console.log(error);
    }
  };

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
                onConfirmClick={handleConfirmClick}
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
