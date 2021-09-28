import React from 'react';

import { render, screen } from 'test/test-utils';

import SidePanelListItem from './side-panel-list-item.component';

const VIEW = 'Users';

describe('SidePanelListItem', () => {
  it('renders a SidePanelListItem', () => {
    const Icon = () => <h1>I Am an icon</h1>;
    render(<SidePanelListItem view={VIEW} Icon={Icon} to="/route" />);

    expect(screen.getByText(VIEW)).toBeInTheDocument();
    expect(screen.getByLabelText(`${VIEW} Icon`)).toBeInTheDocument();
  });
});
