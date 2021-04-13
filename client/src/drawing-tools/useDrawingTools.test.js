import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useDrawingTools } from './useDrawingTools';
import configureMockStore from 'redux-mock-store';
import { setFeatures } from './drawing-tools.slice';
import { waitFor } from '@testing-library/dom';

/** @type {import('@turf/helpers').FeatureCollection} */
const INITIAL_FEATURES = {
  type: 'FeatureCollection',
  features: [{ type: 'Point' }],
};

const mockStore = configureMockStore();

const render = (features = INITIAL_FEATURES.features) => {
  const store = mockStore({
    drawingTools: {
      features,
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

    describe('getFillColor', () => {
      it('returns a color based on index', () => {
        const { result } = render([{ id: 1 }, { id: 2 }]);
        const { editableLayer } = result.current;
        const color = editableLayer.props.getFillColor({ id: 1 });
        expect(color).toEqual(expect.arrayContaining([0, 121, 159]));
      });

      it('Uses an alpha of 0.5', () => {
        const { result } = render([{ id: 1 }, { id: 2 }]);
        const { editableLayer } = result.current;
        const color = editableLayer.props.getFillColor({ id: 1 });
        expect(color).toEqual(expect.arrayContaining([127.5]));
      });

      it('Uses full brightness when feature is selected', () => {
        const { result } = render([{ id: 1 }, { id: 2 }]);
        const { editableLayer } = result.current;
        const color = editableLayer.props.getFillColor({ id: 1 }, true);
        expect(color).toEqual(expect.arrayContaining([0, 174, 228]));
      });
    });

    describe('getLineColor', () => {
      it('returns a color based on index', () => {
        const { result } = render([{ id: 1 }, { id: 2 }]);
        const { editableLayer } = result.current;
        const color = editableLayer.props.getLineColor({ id: 2 });
        expect(color).toEqual(expect.arrayContaining([152, 168, 158]));
      });

      it('Uses an alpha of 0.5', () => {
        const { result } = render([{ id: 1 }, { id: 2 }]);
        const { editableLayer } = result.current;
        const color = editableLayer.props.getLineColor({ id: 2 });
        expect(color).toEqual(expect.arrayContaining([255]));
      });

      it('Uses full brightness when feature is selected', () => {
        const { result } = render([{ id: 1 }, { id: 2 }]);
        const { editableLayer } = result.current;
        const color = editableLayer.props.getLineColor({ id: 2 }, true);
        expect(color).toEqual(expect.arrayContaining([218, 240, 227]));
      });
    });

    describe('onClick', async () => {
      const { result } = render();
      const { editableLayer } = result.current;
      editableLayer.props.onClick(INITIAL_FEATURES.features[0]);
      await waitFor(() =>
        expect(editableLayer.props.selectedFeatureIndexes).toEqual([0]),
      );
    });
  });
});
