import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { OrbDetails } from './orb-details.component';

const orbs = [
  { id: 1, name: 'Orb 1 Name', description: 'Orb 1 Description', images: [''] },
  { id: 2, name: 'Orb 2 Name', description: 'Orb 2 Description', images: [''] },
];

describe('<OrbDetails />', () => {
  it('Shows the name of the orb from the route', () => {
    render(<OrbDetails orbs={orbs} match={{ params: { orbId: '1' } }} />);

    expect(
      screen.getByRole('heading', { name: orbs[0].name }),
    ).toBeInTheDocument();
  });

  it('Shows the description of the orb from the route', () => {
    render(<OrbDetails orbs={orbs} match={{ params: { orbId: '1' } }} />);

    expect(screen.getByText(orbs[0].description)).toBeInTheDocument();
  });

  it('Shows the product images', () => {
    render(<OrbDetails orbs={orbs} match={{ params: { orbId: '1' } }} />);

    expect(
      screen.getByRole('img', { name: 'Orb 1 Name Example' }),
    ).toBeInTheDocument();
  });

  it('Goes back when the back button is clicked', () => {
    const history = { goBack: jest.fn() };
    render(
      <OrbDetails
        orbs={orbs}
        match={{ params: { orbId: '1' } }}
        history={history}
      />,
    );

    userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(history.goBack).toBeCalled();
  });

  it('Has a minimum users of 3 and maximum of 30', () => {
    render(<OrbDetails orbs={orbs} match={{ params: { orbId: '1' } }} />);

    userEvent.click(screen.getByRole('button', { name: /Number of Users/i }));
    expect(screen.getByRole('option', { name: /^3$/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /30/ })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /^2$/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /31/ }),
    ).not.toBeInTheDocument();
  });

  it('Navigates to the checkout view with the orb and number of seats as params', () => {
    const { history } = render(
      <OrbDetails orbs={orbs} match={{ params: { orbId: '1' } }} />,
    );

    userEvent.click(screen.getByRole('button', { name: /Number of Users/i }));
    userEvent.click(screen.getByRole('option', { name: '5' }));
    userEvent.click(screen.getByRole('link', { name: /get access/i }));
    expect(history.location.pathname).toContain('/checkout');
    expect(history.location.search).toBe('?orbId=1&users=5');
  });
});
