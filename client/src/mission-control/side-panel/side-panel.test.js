import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { VIEWS } from '../mission-control.constants';
import { SidePanel } from './side-panel.component';

const setup = ({ userIsAdmin = true }) => {
  const { history } = render(<SidePanel userIsAdmin={userIsAdmin} />);
  return { history };
};

describe('MissionControlSidePanel', () => {
  it('renders a side panel', () => {
    setup({});

    Object.values(VIEWS).forEach(view => {
      expect(screen.getByText(view.label)).toBeInTheDocument();
      expect(screen.getByLabelText(`${view.label} Icon`)).toBeInTheDocument();
    });
  });

  it('switches views when button is clicked', () => {
    const { history } = setup({});

    userEvent.click(screen.getByText(VIEWS.users.label));

    expect(history.location.pathname).toContain(VIEWS.users.route);
  });

  it("Doesn't show admin views if the user is not an admin", () => {
    setup({ userIsAdmin: false });
    expect(
      screen.queryByRole('link', { name: /Orbis Store/i }),
    ).not.toBeInTheDocument();
  });
});
