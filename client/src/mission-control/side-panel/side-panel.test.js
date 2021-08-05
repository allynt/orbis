import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { VIEWS } from '../mission-control.constants';
import { SidePanel } from './side-panel.component';

const renderComponent = (userIsAdmin = true) => {
  const history = createMemoryHistory();
  const utils = render(<SidePanel userIsAdmin={userIsAdmin} />, {
    wrapper: props => <Router history={history} {...props} />,
  });
  return { ...utils, history };
};

describe('MissionControlSidePanel', () => {
  it('renders a side panel', () => {
    const { getByText, getByLabelText } = renderComponent();

    Object.values(VIEWS).forEach(view => {
      expect(getByText(view.label)).toBeInTheDocument();
      expect(getByLabelText(`${view.label} Icon`)).toBeInTheDocument();
    });
  });

  it('switches views when button is clicked', () => {
    const { getByText, history } = renderComponent();

    userEvent.click(getByText(VIEWS.users.label));

    expect(history.location.pathname).toContain(VIEWS.users.route);
  });

  it("Doesn't show admin views if the user is not an admin", () => {
    const { queryByRole } = renderComponent(false);
    expect(
      queryByRole('link', { name: /Orbis Store/i }),
    ).not.toBeInTheDocument();
  });
});
