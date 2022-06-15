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

  render(<H2OrbDashboard sourceId="astrosat/h2orb/dashboard/latest" />, {
    state,
  });
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
      screen.getByRole('heading', { name: 'H2Orb Dashboard' }),
    ).toBeInTheDocument();
  });

  it('should render skeletons if no data present', () => {
    renderComponent();

    expect(screen.getAllByRole('skeleton')).toHaveLength(4);
  });
});
