import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapProvider } from 'MapContext';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Map from './map.component';
import { setViewport } from './map.slice';

jest.mock('deck.gl');

const mockStore = configureStore();

const setup = initialState => {
  const store = mockStore(initialState);
  const utils = render(
    <Provider store={store}>
      <Map />
    </Provider>,
    {
      wrapper: MapProvider,
    },
  );
  return { ...utils, store };
};

describe('<Map />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

  it('displays the load mask when bookmarks is loading', () => {
    const { getByTestId } = setup({ bookmarks: { isLoading: true } });
    expect(getByTestId('load-mask')).toBeInTheDocument();
  });

  it('sets the viewport when a bookmark is selected', async () => {
    const { store } = setup({
      bookmarks: {
        selectedBookmark: { center: [1, 2], zoom: 3 },
        loading: true,
      },
    });
    const viewportAction = store
      .getActions()
      .find(action => action.type === setViewport.type);
    expect(viewportAction.payload).toHaveProperty('longitude', 1);
    expect(viewportAction.payload).toHaveProperty('latitude', 2);
    expect(viewportAction.payload).toHaveProperty('zoom', 3);
  });

  it('displays the map style switcher when the style button is clicked', () => {
    const { getByText, getByTitle } = setup({
      app: {
        config: {
          mapStyles: [
            { id: 'light', title: 'style one' },
            { id: 'dark', title: 'style two' },
          ],
        },
      },
      map: {
        selectedMapStyle: { id: 'light' },
      },
    });
    userEvent.click(getByTitle('layers'));
    expect(getByText('style one')).toBeInTheDocument();
  });

  it('hides the style switcher when the style button is clicked again', () => {
    const { getByText, getByTitle, queryByText } = setup({
      app: {
        config: {
          mapStyles: [
            { id: 'light', title: 'style one' },
            { id: 'dark', title: 'style two' },
          ],
        },
      },
      map: {
        selectedMapStyle: { id: 'light' },
      },
    });
    userEvent.click(getByTitle('layers'));
    expect(getByText('style one')).toBeInTheDocument();
    userEvent.click(getByTitle('layers'));
    expect(queryByText('style one')).not.toBeInTheDocument();
  });

  it('sets the selected map style in state when the style is changed', () => {
    const { getByText, getByTitle, store } = setup({
      app: {
        config: {
          mapStyles: [
            { id: 'light', title: 'style one' },
            { id: 'dark', title: 'style two' },
          ],
        },
      },
      map: {
        selectedMapStyle: { id: 'light' },
      },
    });
    userEvent.click(getByTitle('layers'));
    userEvent.click(getByText('style two'));
    waitFor(() => {
      expect(store.getState().map.selectedMapStyle.id).toEqual('dark');
    });
  });
});
