import { fireEvent } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { removeFeaturesByIndex, setFeatures } from './drawing-tools.slice';
import { useDrawingTools } from './useDrawingTools';

/** @type {import('@turf/helpers').FeatureCollection} */
const INITIAL_FEATURES = {
  type: 'FeatureCollection',
  features: [{ type: 'Point' }],
};

const mockStore = configureMockStore();

const render = ({
  mapStyle = undefined,
  features = INITIAL_FEATURES.features,
  defaultSelectedFeatureIndexes = undefined,
  defaultDrawMode = undefined,
  defaultDrawingToolsEnabled = undefined,
} = {}) => {
  const store = mockStore({
    map: {
      selectedMapStyle: mapStyle,
    },
    drawingTools: {
      features,
    },
  });
  const utils = renderHook(
    () =>
      useDrawingTools({
        defaultSelectedFeatureIndexes,
        defaultDrawMode,
        defaultDrawingToolsEnabled,
      }),
    {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    },
  );
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
        const { result } = render({ features: [{ id: 1 }, { id: 2 }] });
        const { editableLayer } = result.current;
        const color = editableLayer.props.getFillColor({ id: 1 });
        expect(color).toEqual(expect.arrayContaining([0, 121, 159]));
      });

      it('Uses an alpha of 0.5', () => {
        const { result } = render({ features: [{ id: 1 }, { id: 2 }] });
        const { editableLayer } = result.current;
        const color = editableLayer.props.getFillColor({ id: 1 });
        expect(color).toEqual(expect.arrayContaining([127.5]));
      });

      it('Uses full brightness when feature is selected', () => {
        const { result } = render({ features: [{ id: 1 }, { id: 2 }] });
        const { editableLayer } = result.current;
        const color = editableLayer.props.getFillColor({ id: 1 }, true);
        expect(color).toEqual(expect.arrayContaining([0, 174, 228]));
      });
    });

    describe('getLineColor', () => {
      it('returns a color based on index', () => {
        const { result } = render({ features: [{ id: 1 }, { id: 2 }] });
        const { editableLayer } = result.current;
        const color = editableLayer.props.getLineColor({ id: 2 });
        expect(color).toEqual(expect.arrayContaining([152, 168, 158]));
      });

      it('Uses an alpha of 0.5', () => {
        const { result } = render({ features: [{ id: 1 }, { id: 2 }] });
        const { editableLayer } = result.current;
        const color = editableLayer.props.getLineColor({ id: 2 });
        expect(color).toEqual(expect.arrayContaining([255]));
      });

      it('Uses full brightness when feature is selected', () => {
        const { result } = render({ features: [{ id: 1 }, { id: 2 }] });
        const { editableLayer } = result.current;
        const color = editableLayer.props.getLineColor({ id: 2 }, true);
        expect(color).toEqual(expect.arrayContaining([218, 240, 227]));
      });
    });

    describe('onClick', () => {
      it("does not do anything if drawing tools aren't enabled", () => {
        const { result } = render();
        act(() => {
          result.current.editableLayer.props.onClick({ index: 0 });
        });
        expect(
          result.current.editableLayer.props.selectedFeatureIndexes,
        ).toEqual([]);
      });

      it('Sets the clicked feature as selected', () => {
        const { result } = render({ defaultDrawingToolsEnabled: true });
        act(() => {
          result.current.editableLayer.props.onClick({ index: 0 });
        });
        expect(
          result.current.editableLayer.props.selectedFeatureIndexes,
        ).toEqual([0]);
      });

      it('Removes the clicked feature from selected if already selected', () => {
        const { result } = render({
          defaultDrawingToolsEnabled: true,
          defaultSelectedFeatureIndexes: [0],
        });
        act(() => {
          result.current.editableLayer.props.onClick({ index: 0 });
        });
        expect(
          result.current.editableLayer.props.selectedFeatureIndexes,
        ).toEqual([]);
      });
    });

    describe('subLayerProps', () => {
      it.each`
        color      | style          | expectedArray
        ${'white'} | ${'dark'}      | ${[255, 255, 255, 255]}
        ${'white'} | ${'satellite'} | ${[255, 255, 255, 255]}
        ${'black'} | ${'light'}     | ${[0, 0, 0, 255]}
        ${'black'} | ${'streets'}   | ${[0, 0, 0, 255]}
      `(
        'Renders tooltips $color when map style is $style',
        ({ style, expectedArray }) => {
          const { result } = render({ mapStyle: style });
          expect(
            result.current.editableLayer.props._subLayerProps.tooltips.getColor,
          ).toEqual(expectedArray);
        },
      );
    });
  });

  describe('Key presses', () => {
    it.each(['Delete', 'Backspace'])(
      'Deletes the selected features when %s is pressed',
      key => {
        const { store } = render({
          defaultDrawingToolsEnabled: true,
          defaultSelectedFeatureIndexes: [0],
        });
        act(() => {
          fireEvent.keyUp(document, { key });
        });
        expect(store.getActions()).toEqual(
          expect.arrayContaining([removeFeaturesByIndex([0])]),
        );
      },
    );
  });

  describe('Enabling and disabling', () => {
    it('Is in ViewMode by default', () => {
      const { result } = render();
      expect(result.current.drawMode).toBe('ViewMode');
    });

    it('Changes mode to TranslateMode when enabled', () => {
      const { result } = render();
      act(() => result.current.setDrawingToolsEnabled(true));
      expect(result.current.drawMode).toBe('TranslateMode');
    });

    it('Changes mode to ViewMode when disabled', () => {
      const { result } = render({
        defaultDrawingToolsEnabled: true,
        defaultDrawMode: 'TranslateMode',
      });
      act(() => result.current.setDrawingToolsEnabled(false));
      expect(result.current.drawMode).toBe('ViewMode');
    });

    it('Deselects all selected features when disabled', () => {
      const { result } = render({
        defaultDrawingToolsEnabled: true,
      });
      act(() => result.current.editableLayer.props.onClick({ index: 0 }));
      act(() => result.current.setDrawingToolsEnabled(false));
      expect(result.current.editableLayer.props.selectedFeatureIndexes).toEqual(
        [],
      );
    });
  });
});
