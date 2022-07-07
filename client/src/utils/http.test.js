import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { server } from 'mocks/server';

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
  let origFetch = null;
  let fetchMock = null;

  beforeEach(() => {
    beforeState = {
      accounts: USER_STATE,
    };
    store = mockStore(beforeState);

    origFetch = global.fetch;
    fetchMock = jest.spyOn(window, 'fetch');
  });

  afterEach(() => {
    global.fetch = origFetch;
  });

  it('should post successfully even though no data or headers', async () => {
    server.use(
      rest.post('*/api/test', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    const url = '/api/test';

    const response = await sendData(url);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][1].headers).toEqual({});
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({});
  });

  it('should post successfully with no data set, but with custom headers', async () => {
    server.use(
      rest.post('*/api/test', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    const {
      accounts: { userKey },
    } = store.getState();

    const url = '/api/test';
    const headers = { Authentication: 'Token ' + userKey };

    const response = await sendData(url, '', headers);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetchMock.mock.calls.length).not.toEqual(0);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][1].headers).toEqual(headers);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({});
  });

  it('should post data successfully with data but no custom headers', async () => {
    const data = { key: 'value' };

    server.use(
      rest.post('*/api/test', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(data));
      }),
    );

    const url = '/api/test';

    const response = await sendData(url, data);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetchMock.mock.calls.length).not.toEqual(0);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][1].headers).toEqual({});
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(data);
  });

  it('should post data successfully with data and custom headers', async () => {
    const data = { key: 'value' };

    server.use(
      rest.post('*/api/test', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(data));
      }),
    );

    const {
      accounts: { userKey },
    } = store.getState();

    const url = '/api/test';
    const headers = { ...JSON_HEADERS, Authentication: 'Token ' + userKey };

    const response = await sendData(url, data, headers);

    expect(response).toBeDefined();
    expect(response.message).not.toBeDefined();
    expect(fetchMock.mock.calls.length).not.toEqual(0);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][1].headers).toEqual(headers);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(data);
  });

  it('should post data unsuccessfully', async () => {
    const url = '/api/test';
    server.use(
      rest.post(`*${url}`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({ message: 'Error posting data' }),
        );
      }),
    );

    const {
      accounts: { userKey },
    } = store.getState();

    const headers = { ...JSON_HEADERS, Authentication: 'Token ' + userKey };
    const data = { key: 'value' };

    const response = await sendData(url, data, headers);

    expect(response).toBeDefined();
    expect(fetchMock.mock.calls.length).not.toEqual(0);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][1].headers).toEqual(headers);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(data);
  });
});
