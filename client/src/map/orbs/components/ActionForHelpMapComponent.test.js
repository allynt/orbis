import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import ActionForHelpMapComponent from './ActionForHelpMapComponent';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';

import { setData } from '../layers.slice.js';

const mockStore = configureMockStore();
jest.mock('react-map-gl', () => ({ Popup: ({ children }) => <>{children}</> }));

const sourceId = 'test/layer';
const feature = {
  id: '123',
  geometry: { coordinates: [0, 1] },
  properties: { pk: '123', Type: true },
};
const state = {
  orbs: {
    layers: {
      [sourceId]: {
        clickedFeatures: [feature],
        data: { features: [feature] },
      },
    },
  },
};

const renderComponent = () => {
  const store = mockStore(state);
  const utils = render(
    <ActionForHelpMapComponent source={{ source_id: sourceId }} />,
    {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    },
  );
  return { ...utils, store };
};

describe('<ActionForHelpMapComponent />', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('updateNoteOrStatus', () => {
    it('Makes the update response with the new note or status', () => {
      fetch.once(JSON.stringify({}));
      const note = 'Test note';
      const { getByRole } = renderComponent();
      userEvent.type(getByRole('textbox', { name: 'Popup Note' }), note);
      userEvent.click(getByRole('button', { name: 'Save' }));
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/${feature.properties.pk}`),
        expect.objectContaining({ body: JSON.stringify({ notes: note }) }),
      );
    });

    it('Dispatches the setData action with the updated data from the response', async () => {
      const note = 'Test note';
      fetch.once(
        JSON.stringify({
          ...feature.properties,
          notes: note,
        }),
      );

      const expectedActions = setData({
        key: sourceId,
        data: {
          features: [
            {
              ...feature,
              properties: {
                ...feature.properties,
                notes: note,
              },
            },
          ],
        },
      });

      const { getByRole, store } = renderComponent();
      userEvent.type(getByRole('textbox', { name: 'Popup Note' }), note);
      userEvent.click(getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(store.getActions()).toContainEqual(expectedActions);
      });
    });
  });
});
