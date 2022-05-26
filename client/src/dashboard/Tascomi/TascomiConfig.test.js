import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import TascomiDashboard from './TascomiConfig.component';

const state = {
  dashboard: {
    'test-source-id': {
      TascomiDashboardData: { properties: [{ 'Application ID': 456 }] },
    },
  },
};

describe('TascomiConfig', () => {
  it('renders', () => {
    render(<TascomiDashboard sourceId="test-source-id" applicationId="456" />, {
      state,
    });

    expect(
      screen.getByRole('tab', { name: 'Project Info' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: 'Timeline' })).toBeInTheDocument();
  });

  it('switches tab panels', () => {
    render(<TascomiDashboard sourceId="test-source-id" applicationId="456" />, {
      state,
    });

    expect(
      screen.getByRole('heading', { name: 'Reference Numbers' }),
    ).toBeInTheDocument();

    // TODO:  FAO Steven - update this similarly when data content in timeline view
    expect(screen.queryByText('Timeline Component')).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('tab', { name: 'Timeline' }));

    // TODO:  This too
    expect(screen.getByText('Timeline Component')).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Reference Numbers' }),
    ).not.toBeInTheDocument();
  });

  it('shows `loading` message if data in global state', () => {
    render(<TascomiDashboard sourceId="test-source-id" applicationId="456" />, {
      state: {},
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows `not found` message if no feature', () => {
    render(<TascomiDashboard sourceId="test-source-id" applicationId="123" />, {
      state,
    });

    expect(
      screen.getByText('No information found for this feature.'),
    ).toBeInTheDocument();
  });
});
