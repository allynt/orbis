import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import TascomiDashboard from './TascomiConfig.component';

const SOURCE_ID = 'astrosat/test/source/id';
const APPLICATION_ID = 123;

describe('TascomiConfig', () => {
  it('renders the dashboard with tabs', () => {
    render(
      <TascomiDashboard sourceId={SOURCE_ID} applicationId={APPLICATION_ID} />,
    );

    expect(
      screen.getByRole('heading', { name: /tascomi planning and exacom/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('tab', { name: 'Project Info' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Timeline' })).toBeInTheDocument();
  });

  it('switches tab panels', () => {
    render(
      <TascomiDashboard sourceId={SOURCE_ID} applicationId={APPLICATION_ID} />,
      {
        state: {
          dashboard: {
            [SOURCE_ID]: {
              TascomiDashboardData: {
                properties: [
                  {
                    'Application ID': APPLICATION_ID,
                    data: [
                      {
                        Type: 'Tascomi',
                        Description: 'Planning permission granted',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    );

    // TODO: will need updated once components are fleshed out.
    const regEx = /tascomi - Planning permission granted/i;
    expect(screen.getByText('Project Info Component')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: regEx,
      }),
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('tab', { name: 'Timeline' }));

    expect(
      screen.getByRole('heading', {
        name: regEx,
      }),
    ).toBeInTheDocument();
  });
});
