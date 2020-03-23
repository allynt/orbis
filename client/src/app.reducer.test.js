import reducer from './app.reducer';
import { FETCH_APP_CONFIG_SUCCESS, FETCH_APP_CONFIG_FAILURE, NOT_YET_IMPLEMENTED } from './app.actions';

describe('App reducer', () => {
  let initialState = null;

  beforeEach(() => {
    initialState = {
      config: {},
      error: null,
      notYetImplementedDescription: null
    };
  });

  it('should return the initial state', () => {
    const actualState = reducer(undefined, {});

    expect(actualState).toEqual(expect.objectContaining(initialState));
  });

  it('should update the app config in state', () => {
    const config = {
      mapStyles: []
    };
    const actualState = reducer(initialState, {
      type: FETCH_APP_CONFIG_SUCCESS,
      config
    });

    expect(actualState.config).toEqual(config);
  });

  it('should set the error state, when failed to retrieve app config', () => {
    const error = 'ERROR';
    const actualState = reducer(initialState, {
      type: FETCH_APP_CONFIG_FAILURE,
      error
    });

    expect(actualState.error).toEqual(error);
  });

  it('should set the `not yet implemented` message in state', () => {
    const text = 'Test Text';

    const actualState = reducer(initialState, {
      type: NOT_YET_IMPLEMENTED,
      text
    });

    expect(actualState.notYetImplementedDescription).toEqual(text);
  });
});
