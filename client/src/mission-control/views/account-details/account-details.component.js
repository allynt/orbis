import React from 'react';

import { Grid, withWidth } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';
import {
  selectCurrentCustomer,
  updateCustomer,
} from 'mission-control/mission-control.slice';

import { Form } from './form/form.component';
import { Info } from './info/info.component';

/**
 * @param {{width?: string}} props
 */
export const AccountDetailsComponent = ({ width }) => {
  const customer = useSelector(selectCurrentCustomer);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <Grid container spacing={width === 'lg' || width === 'xl' ? 4 : 2}>
        <Grid item xs={12} sm={12} md={4}>
          <Info
            organisationId={customer.id}
            organisationName={customer.name}
            userName={user.name}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Form
            userEmail={user.email}
            customer={customer}
            onSubmit={values =>
              dispatch(updateCustomer({ ...customer, ...values }))
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default withWidth()(AccountDetailsComponent);
