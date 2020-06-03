import React from 'react';

import { render } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Admin from './admin.component';

describe('Admin Component', () => {
  let history = null;
  let users = null;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
    users = users = [
      { id: 1, name: 'John Smith' },
      { id: 2, Name: 'Steve Brown' },
    ];
  });

  it('should render links to admin areas', () => {
    const { getByText } = render(
      <Router history={history}>
        <Admin users={users} />
      </Router>,
    );
  });
});
