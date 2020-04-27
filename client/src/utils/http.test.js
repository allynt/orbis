import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { sendData, JSON_HEADERS } from '../utils/http';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const USER_STATE = {
  userKey: 'authenticationToken',
  user: null,
  error: null,
};

describe('Http', () => {
  let beforeState;
  let store;

  beforeEach(() => {
    beforeState = {
      accounts: USER_STATE,
    };
    store = mockStore(beforeState);

    fetch.resetMocks();
  });

  it('should post successfully even though no data or headers', async () => {
    fetch.mockResponse('');

    const url = '/api/test';

    const response = await sendData(url);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetch.mock.calls.length).not.toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].headers).toEqual({});
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({});
  });

  it('should post successfully with no data set, but with custom headers', async () => {
    fetch.mockResponse('');

    const {
      accounts: { userKey },
    } = store.getState();

    const url = '/api/test';
    const headers = { Authentication: 'Token ' + userKey };

    const response = await sendData(url, '', headers);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetch.mock.calls.length).not.toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].headers).toEqual(headers);
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({});
  });

  it('should post data successfully with data but no custom headers', async () => {
    const data = { key: 'value' };
    fetch.mockResponse(JSON.stringify(data));

    const url = '/api/test';

    const response = await sendData(url, data);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetch.mock.calls.length).not.toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].headers).toEqual({});
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(data);
  });

  it('should post data successfully with data and custom headers', async () => {
    const data = { key: 'value' };
    fetch.mockResponse(JSON.stringify(data));

    const {
      accounts: { userKey },
    } = store.getState();

    const url = '/api/test';
    const headers = { ...JSON_HEADERS, Authentication: 'Token ' + userKey };

    const response = await sendData(url, data, headers);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetch.mock.calls.length).not.toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].headers).toEqual(headers);
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(data);
  });

  it('should post data unsuccessfully', async () => {
    fetch.mockReject({ message: 'Error posting data' });

    const {
      accounts: { userKey },
    } = store.getState();

    const url = '/api/test';
    const headers = { ...JSON_HEADERS, Authentication: 'Token ' + userKey };
    const data = { key: 'value' };

    const response = await sendData(url, data, headers);

    expect(response).toBeDefined();
    expect(response.message).toEqual('Error posting data');
    expect(fetch.mock.calls.length).not.toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].headers).toEqual(headers);
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(data);
  });
});
