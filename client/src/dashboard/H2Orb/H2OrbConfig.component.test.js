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
          metadata: {
            application: {
              orbis: {
                dashboard_component: {
                  indicators: {
                    pH: {
                      name: 'pH',
                      info: 'pH Info',
                      units: 'pH',
                      range: {
                        min: 6,
                        max: 9,
                      },
                    },
                    temperature: {
                      name: 'Temperature',
                      info: 'Temperature Info',
                      units: '\u00b0C',
                      range: {
                        min: 10,
                        max: 40,
                      },
                    },
                    EC: {
                      name: 'Electrical Conductivity',
                      info: 'Electrical Conductivity Info',
                      units: '\u00b5S/cm',
                      range: {
                        min: 150,
                        max: 800,
                      },
                    },
                    DO_mg_L: {
                      name: 'Dissolved Oxygen',
                      info: 'Dissolved Oxygen Info',
                      units: 'mg/L',
                      range: {
                        min: 2,
                        max: 11,
                      },
                    },
                  },
                },
              },
            },
          },
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
