import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useDrawingTools } from './useDrawingTools';
import configureMockStore from 'redux-mock-store';

/** @type {import('@turf/helpers').FeatureCollection} */
const INITIAL_FEATURES = {
  type: 'FeatureCollection',
  features: [{ type: 'Point' }],
};

const mockStore = configureMockStore();

const render = () => {
  return renderHook(() => useDrawingTools(), {
    wrapper: ({ children }) => (
      <Provider
        store={mockStore({
          drawingTools: {
            featureCollection: INITIAL_FEATURES,
          },
        })}
      >
        {children}
      </Provider>
    ),
  });
};

describe('useDrawingTools', () => {
  describe('editableLayer', () => {
    it('Is a layer containing features from state', () => {
      const { result } = render();
      const { editableLayer } = result.current;
      expect(editableLayer.props.data).toEqual(INITIAL_FEATURES);
    });
  });
});
