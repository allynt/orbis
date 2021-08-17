import React from 'react';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = createMockStore([thunk]);

import SavedDocuments from './saved-documents.component';

const DEFAULT_ROUTE = 'mission-control/saved-documents';

const renderComponent = ({initialEntries = DEFAULT_ROUTE}) => {
  const utils = render(
    <Provider
      store={mockStore({
        missionControl: {}
      })}
    >
      <MemoryRouter initialEntries={initialEntries}>
        <SavedDocuments />
      </MemoryRouter>
    </Provider>
  )

  return { ...utils };
}

describe('Saved Documents', () => {
  it('', () => {});
});
