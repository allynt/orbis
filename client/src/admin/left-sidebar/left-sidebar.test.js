import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LeftSidebar from './left-sidebar.component';
import { USER_TABLE } from '../admin.component';

describe('Admin Side Menu Component', () => {
  let setVisiblePanel = null;

  beforeEach(() => {
    setVisiblePanel = jest.fn();
  });

  it.each(['Launch Orbis', 'Home'])('Shows the %s item', item => {
    const { getByText } = render(<LeftSidebar />);
    expect(getByText(item)).toBeInTheDocument();
  });

  it('should return to user table view when the Orbis logo is clicked', () => {
    const { getByTitle } = render(<LeftSidebar setVisiblePanel={setVisiblePanel} />);

    userEvent.click(getByTitle('Orbis Admin Logo'));
    expect(setVisiblePanel).toHaveBeenCalledWith(USER_TABLE);
  });

  it('should switch main panel views when side-menu buttons are clicked', () => {
    const { getByText } = render(<LeftSidebar setVisiblePanel={setVisiblePanel} />);
    userEvent.click(getByText('Home'));
    expect(setVisiblePanel).toHaveBeenCalledWith(USER_TABLE);
  });

  it('should open Orbis in a new tab when "Launch Orbis" link clicked', () => {
    const { getByText } = render(<LeftSidebar />);
    userEvent.click(getByText('Launch Orbis'));
    expect(window.location.pathname).toEqual('/');
  });
});
