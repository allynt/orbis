import React from 'react';

import { BitmapLayer } from '@deck.gl/layers';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { act, renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { Panels } from './satellite.constants';
import { SatellitesProvider, useSatellites } from './satellites-context';
import {
  selectScene,
  setAoi,
  setHoveredScene,
  setIsDrawingAoi,
} from './satellites.slice';

const mockStore = configureMockStore();

/**
 * @param {import('./satellites.slice').SatellitesState
 * } [props]
 */
const renderContext = ({ ...rest } = {}) => {
  const store = mockStore({
    satellites: {
      selectedSceneLayerVisible: false,
      ...rest,
    },
  });
  const utils = renderHook(() => useSatellites(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <SatellitesProvider>{children}</SatellitesProvider>
      </Provider>
    ),
  });
  return { ...utils, store };
};

describe('SatellitesContext', () => {
  describe('drawAoiLayer', () => {
    it("is not returned when isDrawingAoi is false and there's no feature", () => {
      const { result } = renderContext();
      expect(result.current.drawAoiLayer).toBeUndefined();
    });

    it("is returned when isDrawingAoi is true but there's no feature", () => {
      const { result } = renderContext({ isDrawingAoi: true });
      expect(result.current.drawAoiLayer).toBeInstanceOf(EditableGeoJsonLayer);
    });

    it("is returned when isDrawingAoi is false but there's a feature", () => {
      const { result } = renderContext({
        aoi: [],
      });
      expect(result.current.drawAoiLayer).toBeInstanceOf(EditableGeoJsonLayer);
    });

    it('is not visible when the visualisation panel is visible', () => {
      const { result } = renderContext({
        isDrawingAoi: true,
        visiblePanel: Panels.VISUALISATION,
      });
      expect(result.current.drawAoiLayer.props.visible).toBe(false);
    });

    describe('onEdit', () => {
      it('Returns if editType is not addFeature', () => {
        const { result, store } = renderContext({
          isDrawingAoi: true,
        });
        act(() =>
          result.current.drawAoiLayer.props.onEdit({
            editType: 'somethingElse',
          }),
        );
        expect(store.getActions()).not.toContainEqual(setAoi([123, 123]));
      });

      it('sets the aoi', () => {
        const { result, store } = renderContext({
          isDrawingAoi: true,
        });
        act(() =>
          result.current.drawAoiLayer.props.onEdit({
            editType: 'addFeature',
            updatedData: {
              features: [
                { id: '123', geometry: { coordinates: [[123, 123]] } },
              ],
            },
          }),
        );
        expect(store.getActions()).toContainEqual(setAoi([123, 123]));
      });

      it('turns off isDrawingAoi', () => {
        const { result, store } = renderContext({
          isDrawingAoi: true,
        });
        act(() =>
          result.current.drawAoiLayer.props.onEdit({
            editType: 'addFeature',
            updatedData: {
              features: [
                { id: '123', geometry: { coordinates: [[123, 123]] } },
              ],
            },
          }),
        );
        expect(store.getActions()).toContainEqual(setIsDrawingAoi(false));
      });
    });
  });

  describe('scenesLayer', () => {
    it('Renders a featureCollection of scene footprints', () => {
      const scenes = [{ footprint: [123, 123] }, { footprint: [456, 456] }];
      const expected = {
        features: scenes.map(({ footprint }) => ({
          geometry: footprint,
          properties: expect.anything(),
          type: 'Feature',
        })),
        type: 'FeatureCollection',
      };
      const { result } = renderContext({ scenes });
      expect(result.current.scenesLayer.props.data).toEqual(expected);
    });

    it.each([Panels.SEARCH, Panels.VISUALISATION])(
      'is not visible if the visible panel is %s',
      defaultPanel => {
        const { result } = renderContext({ defaultPanel });
        expect(result.current.scenesLayer.props.visible).toBe(false);
      },
    );

    describe('onClick', () => {
      it('Selects the clicked scene on click', () => {
        const scene = { id: 1 };
        const { result, store } = renderContext({ scenes: [scene] });
        result.current.scenesLayer.props.onClick({
          object: { properties: scene },
        });
        expect(store.getActions()).toContainEqual(selectScene(scene));
      });
    });

    describe('getLineWidth', () => {
      it('Returns 3 if the scene is hovered', () => {
        const scene = { id: 1, properties: { id: 1 } };
        const { result } = renderContext({ hoveredScene: scene });
        const value = result.current.scenesLayer.props.getLineWidth(scene);
        expect(value).toBe(3);
      });

      it('Returns 0 if the scene is not hovered', () => {
        const { result } = renderContext({
          hoveredScene: { id: 3 },
        });
        const value = result.current.scenesLayer.props.getLineWidth({
          properties: { id: 1 },
        });
        expect(value).toBe(0);
      });

      it('Returns 0 if hoveredScene is undefined', () => {
        const { result } = renderContext();
        const value = result.current.scenesLayer.props.getLineWidth({
          properties: { id: 1 },
        });
        expect(value).toBe(0);
      });
    });

    describe('onHover', () => {
      it('Dispatches the setHoveredScene action with the scene if present', () => {
        const scene = { id: 1, label: 'Hello' };
        const { result, store } = renderContext();
        result.current.scenesLayer.props.onHover({
          object: { properties: scene },
        });
        expect(store.getActions()).toContainEqual(setHoveredScene(scene));
      });

      it('Dispatches the setHoveredScene action with undefined when no scene is hovered', () => {
        const { result, store } = renderContext();
        result.current.scenesLayer.props.onHover({});
        expect(store.getActions()).toContainEqual(setHoveredScene(undefined));
      });
    });

    describe('getFilterValue', () => {
      it('Returns the cloud cover from the scene', () => {
        const cloudCover = 12345;
        const { result } = renderContext();
        expect(
          result.current.scenesLayer.props.getFilterValue({
            properties: { cloudCover },
          }),
        ).toBe(cloudCover);
      });
    });
  });

  describe('selectedSceneLayer', () => {
    it('uses the selected scene tiles as data', async () => {
      fetch.once(JSON.stringify({ tiles: ['test-url'] }));
      const { result, waitForNextUpdate } = renderContext({
        selectedScene: { id: '123', tile_url: '' },
      });
      await waitForNextUpdate();
      expect(result.current.selectedSceneLayer.props.data).toEqual([
        'test-url',
      ]);
    });

    it('Renders a BitmapLayer', async () => {
      const { result } = renderContext();
      expect(
        result.current.selectedSceneLayer.props.renderSubLayers({
          tile: { bbox: {} },
        }),
      ).toBeInstanceOf(BitmapLayer);
    });

    it.each([Panels.SEARCH, Panels.RESULTS])(
      'Is hidden if the visible panel is %s',
      defaultPanel => {
        const { result } = renderContext({ defaultPanel });
        expect(result.current.selectedSceneLayer.props.visible).toBe(false);
      },
    );
  });
});
