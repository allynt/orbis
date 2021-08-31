import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import Toolbar from './toolbar.component';

describe('<Toolbar/>', () => {
  it('Works if no items are provided', () => {
    const { getByTitle } = render(<Toolbar />);
    expect(getByTitle('Orbis Logo')).toBeInTheDocument();
  });

  it("Calls the item's action on click", () => {
    const items = [
      {
        label: 'Item 1',
        icon: <div aria-label="Item 1" />,
        roles: ['RoleOne'],
        onClick: jest.fn(),
      },
    ];
    const { getByLabelText } = render(<Toolbar items={items} />);
    userEvent.click(getByLabelText(items[0].label));
    expect(items[0].onClick).toHaveBeenCalled();
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
