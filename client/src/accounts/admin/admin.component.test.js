import React from 'react';

import { cleanup, render, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Admin from './admin.component';

describe('Admin Component', () => {
  let history = null;

  afterEach(cleanup);

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
  });

  it('should render links to admin areas', () => {
    const { container, getByText } = render(
      <Router history={history}>
        <Admin />
      </Router>,
    );

    expect(getByText('Admin Users')).toBeInTheDocument();
    expect(getByText('Admin Others')).toBeInTheDocument();
    expect(container.querySelectorAll('a').length).toEqual(2);
  });

  it('should navigate to `Admin Users` page area on clicking link', async () => {
    const { getByText } = render(
      <Router history={history}>
        <Admin />
      </Router>,
    );

    expect(history.location.pathname).toBe('/');
    fireEvent.click(getByText('Admin Users'));
    expect(history.location.pathname).toBe('/users');
  });

  it('should navigate to `Admin Others` area on clicking link', async () => {
    const { getByText } = render(
      <Router history={history}>
        <Admin />
      </Router>,
    );

    expect(history.location.pathname).toBe('/');
    fireEvent.click(getByText('Admin Others'));
    expect(history.location.pathname).toBe('/others');
  });
});
