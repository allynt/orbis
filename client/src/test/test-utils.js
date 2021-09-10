import React from 'react';

import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'MapContext';

const mockStore = createMockStore([thunk]);

/**
 * @param {React.ReactElement} ui
 * @param {(Omit<import('@testing-library/react').RenderOptions, 'queries'>
 *  & {state?: Partial<import('react-redux').DefaultRootState>
 * })} options
 */
function render(ui, { state = {}, ...options } = {}) {
  const store = mockStore(state);
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MapProvider>{children}</MapProvider>
    </Provider>
  );
  const utils = rtlRender(ui, { wrapper: Wrapper, ...options });
  return { ...utils, store };
}

export * from '@testing-library/react';
export { render };
