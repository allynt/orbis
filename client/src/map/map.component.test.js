import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapProvider } from 'MapContext';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Map from './map.component';

jest.mock('deck.gl');

const mockStore = configureStore();

const setup = initialState => {
  const store = mockStore(initialState);
  const utils = render(<Map />, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <MapProvider>{children}</MapProvider>
      </Provider>
    ),
  });
  return { ...utils, store };
};

describe('<Map />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

  it('displays the load mask when bookmarks is loading', () => {
    const { getByTestId } = setup({ bookmarks: { isLoading: true } });
    expect(getByTestId('load-mask')).toBeInTheDocument();
  });

  it.skip('displays the map style switcher when the style button is clicked', () => {
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

  it.skip('hides the style switcher when the style button is clicked again', () => {
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

  it.skip('sets the selected map style in state when the style is changed', () => {
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
