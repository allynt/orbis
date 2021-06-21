import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SidePanelListItem from './side-panel-list-item.component';

const VIEW = 'Users',
  DEFAULT_VIEW = 'DefaultView';

const renderComponent = ({ view = VIEW, mainPanelView = DEFAULT_VIEW }) => {
  const onClick = jest.fn();
  const Icon = () => <h1>I Am an icon</h1>;
  const utils = render(
    <SidePanelListItem
      view={view}
      mainPanelView={mainPanelView}
      onClick={onClick}
      Icon={Icon}
    />,
  );

  return { ...utils, onClick };
};

describe('SidePanelListItem', () => {
  it('renders a SidePanelListItem', () => {
    const { getByText, getByLabelText } = renderComponent({});

    expect(getByText(VIEW)).toBeInTheDocument();
    expect(getByLabelText(`${VIEW} Icon`)).toBeInTheDocument();
  });

  it('calls the onClick when the button is clicked', () => {
    const { getByText, onClick } = renderComponent({});

    userEvent.click(getByText(VIEW));

    expect(onClick).toHaveBeenCalledWith(VIEW);
  });

  it('calls the click handler when the icon is clicked', () => {
    const { getByLabelText, onClick } = renderComponent({});

    userEvent.click(getByLabelText(`${VIEW} Icon`));

    expect(onClick).toHaveBeenCalledWith(VIEW);
  });

  it('does not call the click handler if already selected', () => {
    const { getByLabelText, onClick } = renderComponent({
      mainPanelView: 'Users',
    });

    userEvent.click(getByLabelText(`${VIEW} Icon`));

    expect(onClick).not.toHaveBeenCalled();
  });
});
