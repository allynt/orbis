import React from 'react';

import fetch from 'jest-fetch-mock';

import { render, screen, waitFor, userEvent } from 'test/test-utils';

import { setData } from '../layers.slice.js';
import ActionForHelpMapComponent from './ActionForHelpMapComponent';

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

describe('<ActionForHelpMapComponent />', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('updateNoteOrStatus', () => {
    it('Makes the update response with the new note or status', () => {
      fetch.once(JSON.stringify({}));
      const note = 'Test note';
      render(<ActionForHelpMapComponent source={{ source_id: sourceId }} />, {
        state,
      });

      userEvent.type(screen.getByRole('textbox', { name: 'Popup Note' }), note);
      userEvent.click(screen.getByRole('button', { name: 'Save' }));

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

      const { store } = render(
        <ActionForHelpMapComponent source={{ source_id: sourceId }} />,
        { state },
      );

      userEvent.type(screen.getByRole('textbox', { name: 'Popup Note' }), note);
      userEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(store.getActions()).toContainEqual(expectedActions);
      });
    });
  });
});
