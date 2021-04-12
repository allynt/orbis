import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useDrawingTools } from './useDrawingTools';
import configureMockStore from 'redux-mock-store';
import { setFeatures } from './drawing-tools.slice';

/** @type {import('@turf/helpers').FeatureCollection} */
const INITIAL_FEATURES = {
  type: 'FeatureCollection',
  features: [{ type: 'Point' }],
};

const mockStore = configureMockStore();

const render = () => {
  const store = mockStore({
    drawingTools: {
      features: INITIAL_FEATURES.features,
    },
  });
  const utils = renderHook(() => useDrawingTools(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { ...utils, store };
};

describe('useDrawingTools', () => {
  describe('editableLayer', () => {
    it('Is a layer containing features from state', () => {
      const { result } = render();
      const { editableLayer } = result.current;
      expect(editableLayer.props.data).toEqual(INITIAL_FEATURES);
    });

    describe('onEdit', () => {
      it('dispatches the setFeatures action if editType is addFeature', () => {
        const updatedData = [{}];
        const { result, store } = render();
        const { editableLayer } = result.current;
        editableLayer.props.onEdit({
          editType: 'addFeature',
          updatedData,
        });
        expect(store.getActions()).toEqual(
          expect.arrayContaining([setFeatures(updatedData)]),
        );
      });

      it('does not dispatch the setFeatures action if editType is not addFeature', () => {
        const updatedData = [{}];
        const { result, store } = render();
        const { editableLayer } = result.current;
        editableLayer.props.onEdit({
          editType: 'somethingElse',
          updatedData,
        });
        expect(store.getActions()).not.toEqual(
          expect.arrayContaining([setFeatures(updatedData)]),
        );
      });
    });
  });
});
