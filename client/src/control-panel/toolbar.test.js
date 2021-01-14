import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Toolbar from './toolbar.component';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('<Toolbar/>', () => {
  it('Works if no items are provided', () => {
    const { getByTitle } = render(<Toolbar />);
    expect(getByTitle('Orbis Logo')).toBeInTheDocument();
  });

  it("Calls the item's action on click", () => {
    const items = [
      {
        label: 'Item 1',
        icon: 'Icon 1',
        roles: ['RoleOne'],
        action: jest.fn(),
      },
    ];
    const { getByText } = render(<Toolbar items={items} />);
    userEvent.click(getByText(items[0].icon));
    expect(items[0].action).toHaveBeenCalled();
  });

  it('Navigates to root when the logo is clicked', () => {
    const items = [
      { label: 'Item 1', roles: ['RoleOne'] },
      { label: 'Item 2', roles: ['RoleTwo'] },
    ];

    const history = createMemoryHistory();
    history.push('/fake/not/root/route');

    const { getByTitle } = render(
      <Router history={history}>
        <Toolbar items={items} />
      </Router>,
    );

    userEvent.click(getByTitle('Orbis Logo'));

    expect(history.location.pathname).toBe('/');
  });
});
