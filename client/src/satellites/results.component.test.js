import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent } from '@testing-library/react';

import Results from './results.component';

const mockStore = configureMockStore([thunk]);

describe('Satellite Results Component', () => {
  const store = mockStore({
    accounts: { userKey: { key: '123' } },
    satellites: {
      currentSearchQuery: null
    }
  });
  let scenes = null;
  let setVisiblePanel = null;
  let selectScene = null;
  let setSelectedMoreInfo = null;
  let toggleMoreInfoDialog = null;

  beforeEach(cleanup);

  beforeEach(() => {
    scenes = [
      {
        id: 1,
        cloudCover: 0.5,
        thumbnail_url: '/thumbnail.png',
        created: '2000-01-01T00:00:00Z'
      },
      {
        id: 2,
        cloudCover: 0.9,
        thumbnail_url: '/thumbnail.png',
        created: '2000-01-02T01:00:00Z'
      }
    ];
    setVisiblePanel = jest.fn();
    selectScene = jest.fn();
    setSelectedMoreInfo = jest.fn();
    toggleMoreInfoDialog = jest.fn();
  });

  it('should display a list of Scene results', () => {
    const userKey = { key: 'testkey' };
    const user = { username: 'testusername', email: 'testusername@test.com' };

    fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Results
          scenes={scenes}
          setVisiblePanel={setVisiblePanel}
          selectScene={selectScene}
          setSelectedMoreInfo={setSelectedMoreInfo}
          toggleMoreInfoDialog={toggleMoreInfoDialog}
        />
      </Provider>
    );
  });

  it('should trigger a panel change when setVisiblePanel called', () => {});

  it('should call `selectScene` when result clicked', () => {});

  it('should toggle a `More Info` dialog when button clicked', () => {});
});
