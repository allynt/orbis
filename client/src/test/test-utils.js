import React from 'react';

import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
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
 *    }
 * )} options
 */
function render(ui, { state = {}, history: historyOptions, ...options } = {}) {
  const store = mockStore(state);
  const history = createMemoryHistory(historyOptions);
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>
        <MapProvider>{children}</MapProvider>
      </Router>
    </Provider>
  );
  const utils = rtlRender(ui, { wrapper: Wrapper, ...options });
  return { ...utils, history, store };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { render };
