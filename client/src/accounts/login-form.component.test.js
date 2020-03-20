import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';

import LoginForm from './login-form.component';

const mockStore = configureMockStore([thunk]);

describe('Login Form Component', () => {
  let store = null;
  let login = null;
  let user = null;
  let error = null;

  beforeEach(() => {
    store = mockStore({});
    login = jest.fn();
    user = null;
    error = {};
  });

  afterEach(cleanup);

  it('should render form with `Login` button disabled when form is invalid', () => {
    const { container, getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} error={error} />
      </BrowserRouter>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();

    expect(getByText('Login')).toHaveTextContent('Login');
    expect(getByText('Login')).toHaveAttribute('disabled', '');
  });

  it('should enable `Login` button when form is valid', () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} error={error} />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } });

    expect(getByText('Login')).not.toHaveAttribute('disabled');
  });

  it('should not call `login` function when form is invalid and `Login` button clicked', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} error={error} />
      </BrowserRouter>
    );

    fireEvent.click(getByText('Login'));
    expect(login).not.toHaveBeenCalled();
  });

  it('should call `login` function when form is valid and `Update User` button clicked', () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <LoginForm login={login} user={user} error={error} />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'testusername@test.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(getByText('Login'));
    expect(login).toHaveBeenCalled();
  });
});
