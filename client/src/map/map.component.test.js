import { rest } from 'msw';

import { server } from 'mocks/server';
import { render, screen } from 'test/test-utils';

import Map from './map.component';

jest.mock('@deck.gl/react', () => () => <div />);

describe('<Map />', () => {
  beforeEach(() =>
    server.use(
      rest.get('*/api/stories/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    ),
  );

  it('displays the load mask when bookmarks is loading', () => {
    render(<Map />, {
      state: {
        app: { config: { mapbox_token: '123' } },
        bookmarks: { isLoading: true },
      },
    });

    expect(screen.getByTestId('load-mask')).toBeInTheDocument();
  });

  it('Displays the load mask when the map is loading', () => {
    render(<Map />, {
      state: {
        app: { config: { mapbox_token: '123' } },
        map: { isLoading: true },
      },
    });

    expect(screen.getByTestId('load-mask')).toBeInTheDocument();
  });
});
