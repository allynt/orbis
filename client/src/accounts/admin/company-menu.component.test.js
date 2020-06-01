import React from 'react';

import { cleanup, render, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import CompanyMenu from './company-menu.component';

describe('Admin Company Menu Component', () => {
  let history = null;

  afterEach(cleanup);

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
  });

  xit('should render the admin company menu', () => {
    const { getByText } = render(
      <Router history={history}>
        <CompanyMenu />
      </Router>,
    );

    expect(getByText('Administrator')).toBeInTheDocument();
  });
});
