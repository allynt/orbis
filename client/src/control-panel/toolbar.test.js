import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import Toolbar from './toolbar.component';

describe('<Toolbar/>', () => {
  it('Works if no items are provided', () => {
    render(<Toolbar />);
    expect(screen.getByTitle('Orbis Logo')).toBeInTheDocument();
  });

  it("Calls the item's action on click", () => {
    const items = [
      {
        id: 'test id',
        label: 'Item 1',
        icon: <div aria-label="Item 1" />,
        roles: ['RoleOne'],
        onClick: jest.fn(),
      },
    ];

    render(<Toolbar items={items} />);

    userEvent.click(screen.getByLabelText(items[0].label));
    expect(items[0].onClick).toHaveBeenCalled();
  });

  it('Navigates to root when the logo is clicked', () => {
    const items = [
      { id: 'Item 1', label: 'Item 1', roles: ['RoleOne'] },
      { id: 'Item 2', label: 'Item 2', roles: ['RoleTwo'] },
    ];

    const { history } = render(<Toolbar items={items} />, {
      history: { initialEntries: ['/fake/not/root/route'] },
    });

    userEvent.click(screen.getByTitle('Orbis Logo'));

    expect(history.location.pathname).toBe('/');
  });
});
