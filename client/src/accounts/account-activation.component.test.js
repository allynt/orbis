import React from 'react';

import { cleanup, render } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { status } from './accounts.slice';

import AccountActivation from './account-activation.component';

describe('Account Activation', () => {
  let activateAccount = null;
  let accountActivationSuccessful = null;
  let history = null;
  const match = {
    params: {
      key: 'Test Key',
    },
  };
  let error = null;

  beforeEach(() => {
    activateAccount = jest.fn();
    accountActivationSuccessful = status.NONE;
    history = createMemoryHistory({ initialEntries: ['/'] });
  });
  afterEach(cleanup);

  it('should redirect to login page on successful Activation', () => {
    accountActivationSuccessful = status.COMPLETE;
    render(
      <Router history={history}>
        <AccountActivation
          activateAccount={activateAccount}
          accountActivationSuccessful={accountActivationSuccessful}
          match={match}
        />
      </Router>,
    );

    expect(activateAccount).toHaveBeenCalled();
    expect(history.location.pathname).toEqual('/login');
  });

  it('should not redirect, but display error well on unsuccessful Activation', () => {
    error = ['Test Error 1', 'Test Error 2', 'Test Error 3'];

    const { getByTestId } = render(
      <Router history={history}>
        <AccountActivation
          activateAccount={activateAccount}
          accountActivationSuccessful={accountActivationSuccessful}
          match={match}
          error={error}
        />
      </Router>,
    );

    expect(history.location.pathname).toEqual('/');
    expect(getByTestId('error-well')).toBeInTheDocument();
  });
});
