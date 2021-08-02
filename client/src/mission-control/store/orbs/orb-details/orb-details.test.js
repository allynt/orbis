import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router-dom';

import { OrbDetails } from './orb-details.component';

const orbs = [
  { id: 1, name: 'Orb 1 Name', description: 'Orb 1 Description' },
  { id: 2, name: 'Orb 2 Name', description: 'Orb 2 Description' },
];

const renderComponent = () => {
  const history = createMemoryHistory({ initialEntries: ['/1'] });
  const utils = render(<OrbDetails orbs={orbs} />, {
    wrapper: ({ children }) => (
      <Router history={history}>
        <Route path="/:id">{children}</Route>
      </Router>
    ),
  });
  return { ...utils, history };
};

describe('<OrbDetails />', () => {
  it('Shows the name of the orb from the route', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('heading', { name: orbs[0].name })).toBeInTheDocument();
  });

  it('Shows the description of the orb from the route', () => {
    const { getByText } = renderComponent();
    expect(getByText(orbs[0].description)).toBeInTheDocument();
  });

  it('Shows the product images', () => {
    const { getByRole } = renderComponent();
    expect(
      getByRole('img', { name: 'Orb 1 Name Example' }),
    ).toBeInTheDocument();
  });

  it('Returns to the orbs list when back is clicked', () => {
    const { getByRole, history } = renderComponent();
    userEvent.click(getByRole('link', { name: 'Back' }));
    expect(history.location.pathname).toContain('orbs');
    expect(history.location.pathname).not.toContain('orbs/1');
  });
});
