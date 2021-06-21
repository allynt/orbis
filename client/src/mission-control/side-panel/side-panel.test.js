import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { VIEWS } from '../constants';
import { SidePanel } from './side-panel.component';

const renderComponent = ({ mainPanelView = 'Default View' }) => {
  const setMainPanelView = jest.fn();
  const utils = render(
    <SidePanel
      mainPanelView={mainPanelView}
      setMainPanelView={setMainPanelView}
    />,
  );

  return { ...utils, setMainPanelView };
};

describe('MissionControlSidePanel', () => {
  it('renders a side panel', () => {
    const { getByText } = renderComponent({});

    Object.values(VIEWS).forEach(view => {
      expect(getByText(view)).toBeInTheDocument();
    });
  });

  it('switches views when button is clicked', () => {
    const { getByText, setMainPanelView } = renderComponent({});

    userEvent.click(getByText(VIEWS.users));

    expect(setMainPanelView).toHaveBeenCalledWith(VIEWS.users);
  });

  it('switches views when icon is clicked', () => {
    const { getByLabelText, setMainPanelView } = renderComponent({});

    userEvent.click(getByLabelText(`${VIEWS.users} Icon`));

    expect(setMainPanelView).toHaveBeenCalledWith(VIEWS.users);
  });

  it('does not call click handler if view is already selected', () => {
    const { getByText, setMainPanelView } = renderComponent({
      mainPanelView: VIEWS.users,
    });

    userEvent.click(getByText(VIEWS.users));

    expect(setMainPanelView).not.toHaveBeenCalled();
  });
});
