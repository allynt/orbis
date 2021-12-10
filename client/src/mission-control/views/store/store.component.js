import React, { useEffect } from 'react';

import { find } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { errorSelector, isLoadingSelector } from 'accounts/accounts.selectors';
import { placeOrder } from 'accounts/accounts.slice';
import {
  fetchOrbs,
  fetchSources,
  orbsSelector,
} from 'data-layers/data-layers.slice';
import { useFadeTransitionProps } from 'mission-control/shared-components/useFadeTransitionProps';

import { Checkout } from './checkout/checkout.component';
import { Completion } from './completion/completion.component';
import { OrbDetails } from './orb-details/orb-details.component';
import { Orbs } from './orbs/orbs.component';

/**
 * @returns
 */
export const Store = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orbs = useSelector(orbsSelector);
  const fetchOrbsPending = useSelector(
    state => state?.data?.requests?.fetchOrbs === 'pending',
  );
  const placeOrderPending = useSelector(isLoadingSelector('placeOrder'));
  const accountsErrors = useSelector(errorSelector);
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
      const result = await dispatch(
        placeOrder({
          licences: users,
          subscription: orb.name,
          paymentType: 'standard',
        }),
      );
      /* whenever licences are purchased, I should re-fetch sources */
      dispatch(fetchSources());
      // @ts-ignore
      if (result.type === placeOrder.fulfilled.type) {
        navigate(`/mission-control/store/completion/${orbId}/${users}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TransitionGroup style={{ position: 'relative' }}>
      <CSSTransition {...fadeTransitionProps}>
        <div style={{ position: 'absolute', width: '100%' }}>
          <Routes>
            <Route
              path="/"
              element={<Orbs orbs={orbs} isLoading={fetchOrbsPending} />}
            />
            <Route path="/:orbId" element={<OrbDetails orbs={orbs} />} />
            <Route
              path="/checkout/:orbId/:users"
              element={
                <Checkout
                  orbs={orbs}
                  isLoading={placeOrderPending}
                  errors={accountsErrors}
                  onConfirmClick={handleConfirmClick}
                />
              }
            />
            <Route
              path="/completion/:orbId/:users"
              element={<Completion orbs={orbs} />}
            />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
