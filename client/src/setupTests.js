import '@testing-library/jest-dom';

import fetchMock from 'jest-fetch-mock';

import './polyfills/flat-map';
import './polyfills/array-flat';
import './polyfills/object-fromEntries';

import '../public/config';

fetchMock.enableMocks();

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
