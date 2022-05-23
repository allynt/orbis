import React from 'react';

import { render as rtlRender, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { HistoryRouter } from 'redux-first-history/rr6';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'MapContext';

const mockStore = createMockStore([thunk]);

/**
 * @param {React.ReactElement} ui
 * @param {(Omit<import('@testing-library/react').RenderOptions, 'queries'>
 *  & {
 *      state?: import('typings').RecursivePartial<import('react-redux').DefaultRootState>
 *      history?: import('history').MemoryHistoryBuildOptions
 *      mapParams?: object
 *    }
 * )} options
 */
function render(
  ui,
  { state = {}, history: historyOptions, mapParams = {}, ...options } = {},
) {
  const store = mockStore(state);
  const history = createMemoryHistory(historyOptions);
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <MapProvider value={mapParams}>{children}</MapProvider>
      </HistoryRouter>
    </Provider>
  );
  const utils = rtlRender(ui, { wrapper: Wrapper, ...options });
  return { ...utils, history, store };
}

function fireFileDropEvent(node, file) {
  const event = new Event('drop', { bubbles: true });
  const files = [file];
  const data = {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
  Object.assign(event, data);
  fireEvent(node, event);
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { render, fireFileDropEvent };
