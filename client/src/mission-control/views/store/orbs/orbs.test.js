import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { Orbs } from './orbs.component';

const orbs = [
  { id: 1, shortDescription: 'Orb 1 Short Description', logo: '' },
  { id: 2, shortDescription: 'Orb 2 Short Description', logo: '' },
  { id: 3, shortDescription: 'Orb 3 Short Description' },
];

const renderComponent = (isLoading = false) => {
  const history = createMemoryHistory();
  // @ts-ignore
  const utils = render(<Orbs orbs={orbs} isLoading={isLoading} />, {
    wrapper: ({ children }) => <Router history={history}>{children}</Router>,
  });
  return { ...utils, history };
};

describe('<Orbs />', () => {
  it('shows a tile for each orb', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('listitem')).toHaveLength(orbs.length);
  });

  it('navigates to the individual orb route when a link is clicked', () => {
    const { getAllByRole, history } = renderComponent();
    userEvent.click(getAllByRole('link', { name: 'Learn More' })[0]);
    expect(history.location.pathname).toContain(orbs[0].id);
  });

  it('Shows skeletons if loading', () => {
    const { getAllByRole } = renderComponent(true);
    expect(getAllByRole('listitem')).toHaveLength(3);
  });
});
