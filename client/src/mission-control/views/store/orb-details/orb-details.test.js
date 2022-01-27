import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { render, screen, userEvent } from 'test/test-utils';

import { OrbDetails } from './orb-details.component';

const orbs = [
  {
    id: 1,
    name: 'Orb 1 Name',
    description: 'Orb 1 Description',
    images: [''],
    can_purchase: true,
  },
  {
    id: 2,
    name: 'Orb 2 Name',
    description: 'Orb 2 Description',
    images: [''],
    can_purchase: true,
  },
];

describe('<OrbDetails />', () => {
  it('Shows the name of the orb from the route', () => {
    const { history } = render(
      <Routes>
        <Route path="/:orbId" element={<OrbDetails orbs={orbs} />} />
      </Routes>,
      { history: { initialEntries: ['/1'] } },
    );

    expect(
      screen.getByRole('heading', { name: orbs[0].name }),
    ).toBeInTheDocument();
    expect(history.location.pathname).toEqual('/1');
  });

  it('Shows the description of the orb from the route', () => {
    render(
      <Routes>
        <Route path="/:orbId" element={<OrbDetails orbs={orbs} />} />
      </Routes>,
      { history: { initialEntries: ['/1'] } },
    );

    expect(screen.getByText(orbs[0].description)).toBeInTheDocument();
  });

  it('Shows the product images', () => {
    render(
      <Routes>
        <Route path="/:orbId" element={<OrbDetails orbs={orbs} />} />
      </Routes>,
      { history: { initialEntries: ['/1'] } },
    );

    expect(
      screen.getByRole('img', { name: 'Orb 1 Name Example' }),
    ).toBeInTheDocument();
  });

  it('Goes back when the back button is clicked', () => {
    const goBack = jest.fn();
    render(
      <Routes>
        <Route
          path="/:orbId"
          element={<OrbDetails orbs={orbs} goBack={goBack} />}
        />
      </Routes>,
      { history: { initialEntries: ['/1'] } },
    );

    userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(goBack).toBeCalled();
  });

  it('Has a minimum users of 3 and maximum of 30', () => {
    render(
      <Routes>
        <Route path="/:orbId" element={<OrbDetails orbs={orbs} />} />
      </Routes>,
      { history: { initialEntries: ['/1'] } },
    );

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
      <Routes>
        <Route path="/:orbId" element={<OrbDetails orbs={orbs} />} />
        <Route
          path="/mission-control/store/checkout/:orbId/:users"
          element={<div />}
        />
      </Routes>,
      {
        history: {
          initialEntries: ['/1'],
        },
      },
    );

    userEvent.click(screen.getByRole('button', { name: /Number of Users/i }));
    userEvent.click(screen.getByRole('option', { name: '5' }));
    userEvent.click(screen.getByRole('link', { name: /get access/i }));
    expect(history.location.pathname).toContain('/checkout/1/5');
  });

  it('Hides the access link if the orb cannot be purchased', () => {
    const unpurchaseableOrbs = orbs.map(object => ({
      ...object,
      can_purchase: false,
    }));

    render(
      <Routes>
        <Route
          path="/:orbId"
          element={<OrbDetails orbs={unpurchaseableOrbs} />}
        />
      </Routes>,
      { history: { initialEntries: ['/1'] } },
    );

    expect(
      screen.queryByRole('button', { name: /get access/i }),
    ).not.toBeInTheDocument();
  });

  it('Shows the mailto link if the orb cannot be purchased', () => {
    const unpurchaseableOrbs = orbs.map(object => ({
      ...object,
      can_purchase: false,
    }));

    render(
      <Routes>
        <Route
          path="/:orbId"
          element={<OrbDetails orbs={unpurchaseableOrbs} />}
        />
      </Routes>,
      { history: { initialEntries: ['/1'] } },
    );

    expect(
      screen.getByRole('link', { name: 'sales@astrosat.net' }),
    ).toBeInTheDocument();
  });
});
