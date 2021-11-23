import React from 'react';

import fetchMock from 'jest-fetch-mock';

import { setData } from 'map/orbs/layers.slice';
import { render, screen, waitFor } from 'test/test-utils';

import { Dashboard } from './dashboard.component';

fetchMock.enableMocks();

const defaultRenderOptions = {
  history: { initialEntries: ['/?source_id=some/test/source/1'] },
  state: {
    data: {
      sources: [
        {
          source_id: 'some/test/source/1',
          metadata: {
            url: '',
            application: {
              orbis: {
                dashboard_component: { name: 'TestDashboard' },
              },
            },
          },
        },
      ],
    },
  },
};

describe('<Dashboard />', () => {
  it('Fetches the data for the source if it does not exist in state', async () => {
    const data = { test: 'data' };
    fetchMock.once(JSON.stringify(data));
    const { store } = render(<Dashboard />, defaultRenderOptions);
    await waitFor(() =>
      expect(store.getActions()).toContainEqual(
        expect.objectContaining(setData({ data, key: 'some/test/source/1' })),
      ),
    );
  });

  it('renders the dashboard specified in metadata', async () => {
    fetchMock.once(JSON.stringify({ test: 'data' }));
    render(<Dashboard />, defaultRenderOptions);
    await waitFor(() =>
      expect(screen.getByTestId('test-dashboard')).toBeInTheDocument(),
    );
  });
});
