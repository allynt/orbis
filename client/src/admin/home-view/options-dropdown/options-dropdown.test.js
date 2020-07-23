import React from 'react';
import { render } from '@testing-library/react';

import OptionsDropdown from './options-dropdown.component';
import userEvent from '@testing-library/user-event';

describe('Options Dropdown', () => {
  let textContent = null;
  let onClick = null;
  let close = null;

  const renderComponent = (textContent, onClick, close) =>
    render(
      <OptionsDropdown
        textContent={textContent}
        onClick={onClick}
        close={close}
      />,
    );

  beforeEach(() => {
    textContent = 'Test Text Content';
    onClick = jest.fn();
    close = jest.fn();
  });

  it('renders the button content text', () => {
    const { getByText } = renderComponent(textContent, onClick, close);

    expect(getByText(textContent)).toBeInTheDocument();
  });

  it('calls passed onClick when button is clicked', () => {
    const { getByText } = renderComponent(textContent, onClick, close);

    userEvent.click(getByText(textContent));
    expect(onClick).toHaveBeenCalled();
  });
});
