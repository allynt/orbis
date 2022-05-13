import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import TascomiDashboard from './TascomiConfig.component';

describe('TascomiConfig', () => {
  it('renders', () => {
    render(<TascomiDashboard />);

    expect(
      screen.getByRole('tab', { name: 'Project Info' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: 'Timeline' })).toBeInTheDocument();
  });

  it('switches tab panels', () => {
    render(<TascomiDashboard />);

    // TODO: will need updated once components are fleshed out.

    expect(screen.getByText('Project Info Component')).toBeInTheDocument();
    expect(screen.queryByText('Timeline Component')).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('tab', { name: 'Timeline' }));

    expect(screen.getByText('Timeline Component')).toBeInTheDocument();
    expect(
      screen.queryByText('Project Info Component'),
    ).not.toBeInTheDocument();
  });
});
