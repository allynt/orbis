import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { Completion } from './completion.component';

const renderComponent = () => {
  const history = createMemoryHistory();
  const utils = render(
    <Completion
      orbs={[
        // @ts-ignore
        { id: 1, name: 'Orb 1' },
        // @ts-ignore
        { id: 2, name: 'Orb 2' },
      ]}
      // @ts-ignore
      location={{ search: '?orbId=2&users=23' }}
    />,
    {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    },
  );
  return { ...utils, history };
};

describe('<Completion />', () => {
  it('Shows the name of the orb from params', () => {
    const { getByText } = renderComponent();
    expect(getByText(/Orb 2/)).toBeInTheDocument();
  });

  it('Shows the number of users ordered', () => {
    const { getByText } = renderComponent();
    expect(getByText(/23/)).toBeInTheDocument();
  });

  it('Has a link to the users page', () => {
    const { getByRole, history } = renderComponent();
    userEvent.click(getByRole('link', { name: 'Take me to Users' }));
    expect(history.location.pathname).toContain('/users');
  });
});
