import '@testing-library/jest-dom';

import { server } from 'mocks/server';

import './polyfills/flat-map';
import './polyfills/array-flat';
import './polyfills/object-fromEntries';

import '../public/config';

global.URL.createObjectURL = jest.fn();
global.requestIdleCallback = jest
  .fn()
  .mockImplementation(args => setTimeout(args, 0));

global.orbis = {};
global.orbis.getEnv = () => ({
  REACT_APP_API_HOST: 'http://test.local',
});

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

// MSW
// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
