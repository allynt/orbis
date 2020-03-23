import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  FETCH_APP_CONFIG_SUCCESS,
  FETCH_APP_CONFIG_FAILURE,
  fetchAppConfig,
  DEFAULT_MAP_STYLE,
  NOT_YET_IMPLEMENTED,
  notYetImplemented
} from './app.actions';

import { MAP_STYLE_SELECTED } from './map/map.actions';

const mockStore = configureMockStore([thunk]);

describe('App Actions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should dispatch fetch app config failure action.', async () => {
    fetch.mockResponse(
      JSON.stringify({
        message: 'Test error message'
      }),
      {
        ok: false,
        status: 401,
        statusText: 'Test Error'
      }
    );

    const expectedActions = [{ type: FETCH_APP_CONFIG_FAILURE, error: { message: '401 Test Error' } }];

    const store = mockStore({});

    await store.dispatch(fetchAppConfig());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch fetch app config success action.', async () => {
    const config = {
      mapStyles: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        }
      ]
    };
    fetch.mockResponse(JSON.stringify(config));

    const expectedActions = [
      { type: FETCH_APP_CONFIG_SUCCESS, config },
      { type: MAP_STYLE_SELECTED, mapStyle: config.mapStyles[DEFAULT_MAP_STYLE] }
    ];

    const store = mockStore({});

    await store.dispatch(fetchAppConfig());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch fetch app config success action.', async () => {
    const text = 'Test Text';

    const expectedActions = [{ type: NOT_YET_IMPLEMENTED, text }];

    const store = mockStore({});

    await store.dispatch(notYetImplemented(text));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
