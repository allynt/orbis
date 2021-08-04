import React from 'react';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SidePanelListItem from './side-panel-list-item.component';

const VIEW = 'Users';

const renderComponent = ({ view = VIEW } = {}) => {
  const Icon = () => <h1>I Am an icon</h1>;
  const utils = render(
    <SidePanelListItem view={view} Icon={Icon} to="/route" />,
    {
      wrapper: MemoryRouter,
    },
  );

  return { ...utils };
};

describe('SidePanelListItem', () => {
  it('renders a SidePanelListItem', () => {
    const { getByText, getByLabelText } = renderComponent();

    expect(getByText(VIEW)).toBeInTheDocument();
    expect(getByLabelText(`${VIEW} Icon`)).toBeInTheDocument();
  });
});
