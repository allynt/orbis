import React from 'react';
import configureStore from 'redux-mock-store';
import Map from './map.component';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

jest.mock('@deck.gl/react');

const mockStore = configureStore();

const setup = initialState => {
  const store = mockStore(initialState);
  const utils = render(
    <Provider store={store}>
      <Map />
    </Provider>,
  );
  return { ...utils, store };
};

describe('<Map />', () => {
  it('displays the load mask when bookmarks is loading', () => {
    const { getByTestId } = setup({ bookmarks: { isLoading: true } });
    expect(getByTestId('load-mask')).toBeInTheDocument();
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
