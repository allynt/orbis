import { rest } from 'msw';

import { logout, updateUser } from 'accounts/accounts.slice';
import { server } from 'mocks/server';
import { render, screen, userEvent, waitFor } from 'test/test-utils';

import Profile from './profile.component';

const state = {
  accounts: {
    userKey: '123',
    user: { email: 'fred@gmail.com', name: 'Fred' },
  },
};

describe('<Profile />', () => {
  it('dispatches the logout action when logout is clicked', () => {
    const { store } = render(<Profile />, { state });
    userEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(store.getActions()).toEqual(
      expect.arrayContaining([expect.objectContaining({ ...logout() })]),
    );
  });

  it('dispatches the updateUser action when the user is updated', async () => {
    server.use(
      rest.put('*/users/:userId', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    const { store } = render(<Profile />, { state });
    userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'John');
    userEvent.click(screen.getByRole('button', { name: /update\saccount/i }));
    await waitFor(() =>
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ ...updateUser({}) }),
        ]),
      ),
    );
  });
});
