import * as React from 'react';

import { render, screen } from 'test/test-utils';

import Map from './map.component';

jest.mock('@deck.gl/react');

describe('<Map />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

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
