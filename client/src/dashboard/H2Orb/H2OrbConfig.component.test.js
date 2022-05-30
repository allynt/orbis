import React from 'react';

import { rest } from 'msw';

import { server } from 'mocks/server';
import { render, screen } from 'test/test-utils';

import H2OrbDashboard from './H2OrbConfig.component';

const renderComponent = () => {
  const state = {
    data: {
      tokens: {},
      sources: [
        {
          source_id: 'astrosat/h2orb/dashboard/latest',
        },
      ],
    },
  };

  const component = render(
    <H2OrbDashboard sourceId="astrosat/h2orb/dashboard/latest" />,
    { state },
  );
  return { ...component };
};

describe('H2Orb Dashboard', () => {
  beforeEach(() =>
    server.use(
      rest.get(
        '*/api/proxy/data/astrosat/h2orb/indicators/latest/*',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([{ id: '123' }]));
        },
      ),
    ),
  );

  it('should render a dashboard', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'H2Orb Dashboard Content' }),
    ).toBeInTheDocument();
  });
});
