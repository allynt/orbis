import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { render, screen, userEvent } from 'test/test-utils';

import { Completion } from './completion.component';

describe('<Completion />', () => {
  it('Shows the name of the orb from params', () => {
    render(
      <Routes>
        <Route
          path="/completion/:orbId/:users"
          element={
            <Completion
              orbs={[
                { id: 1, name: 'Orb 1' },
                { id: 2, name: 'Orb 2' },
              ]}
            />
          }
        />
      </Routes>,
      { history: { initialEntries: ['/completion/2/23'] } },
    );

    expect(screen.getByText(/Orb 2/)).toBeInTheDocument();
  });

  it('Shows the number of users ordered', () => {
    render(
      <Routes>
        <Route
          path="/completion/:orbId/:users"
          element={
            <Completion
              orbs={[
                { id: 1, name: 'Orb 1' },
                { id: 2, name: 'Orb 2' },
              ]}
            />
          }
        />
      </Routes>,
      { history: { initialEntries: ['/completion/2/23'] } },
    );

    expect(screen.getByText(/23/)).toBeInTheDocument();
  });

  it('Has a link to the users page', () => {
    const { history } = render(
      <Routes>
        <Route
          path="/completion/:orbId/:users"
          element={
            <Completion
              orbs={[
                { id: 1, name: 'Orb 1' },
                { id: 2, name: 'Orb 2' },
              ]}
            />
          }
        />
        <Route path="/mission-control/users" element={<div />} />
      </Routes>,
      { history: { initialEntries: ['/completion/2/23'] } },
    );

    userEvent.click(screen.getByRole('link', { name: 'Take me to Users' }));
    expect(history.location.pathname).toContain('/users');
  });
});
