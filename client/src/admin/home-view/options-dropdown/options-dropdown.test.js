import React from 'react';
import { render } from '@testing-library/react';

import OptionsDropdown from './options-dropdown.component';
import userEvent from '@testing-library/user-event';

describe('Options Dropdown', () => {
  let onClick = jest.fn();
  let onClickAway = jest.fn();
  let className = 'Test ClassName';
  let children = <button onClick={onClick}>Test Button Text</button>;

  const renderComponent = (children, className, onClickAway) =>
    render(
      <div>
        <button>Not Inside Component</button>
        <OptionsDropdown
          children={children}
          className={className}
          onClickAway={onClickAway}
        >
          {children}
        </OptionsDropdown>
      </div>,
    );

  beforeEach(() => {});

  it('renders the button content text', () => {
    const { getByText } = renderComponent(children, className, onClickAway);

    expect(getByText('Test Button Text')).toBeInTheDocument();
  });

  it('attaches the passed className to the element', () => {
    const { getByTestId } = renderComponent(children, className, onClickAway);

    expect(getByTestId('options-dropdown')).toHaveClass(className);
  });

  it('calls child button onClick when button is clicked', () => {
    const { getByText } = renderComponent(children, className, onClickAway);

    userEvent.click(getByText('Test Button Text'));
    expect(onClick).toHaveBeenCalled();
  });

  it('closes when user clicks outside dropdown', () => {
    const { getByText } = renderComponent(children, className, onClickAway);

    userEvent.click(getByText('Not Inside Component'));
    expect(onClickAway).toHaveBeenCalled();
  });
});
