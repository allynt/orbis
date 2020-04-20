import React from 'react';

import { cleanup, render } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import AccountActivation from './account-activation.component';

describe('Account Activation', () => {
  let activateAccount = null;
  let history = null;
  const match = {
    params: {
      key: 'Test Key'
    }
  };

  beforeEach(() => {
    activateAccount = jest.fn();
    history = createMemoryHistory({ initialEntries: ['/'] });
  });
  afterEach(cleanup);

  it('should redirect to login page on successful Activation', () => {
    render(
      <Router history={history}>
        <AccountActivation activateAccount={activateAccount} match={match} />
      </Router>
    );

    expect(history.location.pathname).toEqual('/login');
  });
});
