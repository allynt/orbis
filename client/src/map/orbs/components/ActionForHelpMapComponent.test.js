import React from 'react';

import { rest } from 'msw';

import { server } from 'mocks/server';
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
  describe('updateNoteOrStatus', () => {
    it('Makes the update response with the new note or status', () => {
      server.use(
        rest.put('*/:id/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const origFetch = global.fetch;
      const fetchMock = jest.spyOn(window, 'fetch');

      const note = 'Test note';
      render(<ActionForHelpMapComponent source={{ source_id: sourceId }} />, {
        state,
      });

      userEvent.type(screen.getByRole('textbox', { name: 'Popup Note' }), note);
      userEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`/${feature.properties.pk}`),
        expect.objectContaining({ body: JSON.stringify({ notes: note }) }),
      );

      global.fetch = origFetch;
    });

    it('Dispatches the setData action with the updated data from the response', async () => {
      const note = 'Test note';

      server.use(
        rest.put('*/:id/', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              ...feature.properties,
              notes: note,
            }),
          );
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
