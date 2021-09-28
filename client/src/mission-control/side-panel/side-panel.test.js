import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { VIEWS } from '../mission-control.constants';
import { SidePanel } from './side-panel.component';

describe('MissionControlSidePanel', () => {
  it('renders a side panel', () => {
    render(<SidePanel userIsAdmin={true} />);

    Object.values(VIEWS).forEach(view => {
      expect(screen.getByText(view.label)).toBeInTheDocument();
      expect(screen.getByLabelText(`${view.label} Icon`)).toBeInTheDocument();
    });
  });

  it('switches views when button is clicked', () => {
    const { history } = render(<SidePanel userIsAdmin={true} />);

    userEvent.click(screen.getByText(VIEWS.users.label));

    expect(history.location.pathname).toContain(VIEWS.users.route);
  });

  it("Doesn't show admin views if the user is not an admin", () => {
    render(<SidePanel userIsAdmin={false} />);
    expect(
      screen.queryByRole('link', { name: /Orbis Store/i }),
    ).not.toBeInTheDocument();
  });
});
