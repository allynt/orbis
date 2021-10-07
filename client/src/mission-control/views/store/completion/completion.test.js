import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { Completion } from './completion.component';

describe('<Completion />', () => {
  it('Shows the name of the orb from params', () => {
    render(
      <Completion
        orbs={[
          { id: 1, name: 'Orb 1' },
          { id: 2, name: 'Orb 2' },
        ]}
        location={{ search: '?orbId=2&users=23' }}
      />,
    );

    expect(screen.getByText(/Orb 2/)).toBeInTheDocument();
  });

  it('Shows the number of users ordered', () => {
    render(
      <Completion
        orbs={[
          { id: 1, name: 'Orb 1' },
          { id: 2, name: 'Orb 2' },
        ]}
        location={{ search: '?orbId=2&users=23' }}
      />,
    );

    expect(screen.getByText(/23/)).toBeInTheDocument();
  });

  it('Has a link to the users page', () => {
    const { history } = render(
      <Completion
        orbs={[
          { id: 1, name: 'Orb 1' },
          { id: 2, name: 'Orb 2' },
        ]}
        location={{ search: '?orbId=2&users=23' }}
      />,
    );

    userEvent.click(screen.getByRole('link', { name: 'Take me to Users' }));
    expect(history.location.pathname).toContain('/users');
  });
});
