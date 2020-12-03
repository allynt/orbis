import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SidebarItem } from './sidebar-item.component';

describe('SidebarItem', () => {
  it('Displays an icon if present', () => {
    const { getByText } = render(<SidebarItem icon={<div>Hello</div>} />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('Displays a label if present', () => {
    const { getByText } = render(<SidebarItem>Hello</SidebarItem>);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('Calls the onClick function when clicked', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <SidebarItem onClick={onClick}>Hello</SidebarItem>,
    );
    userEvent.click(getByText('Hello'));
    expect(onClick).toHaveBeenCalled();
  });
});
