import React from 'react';

import { BitmapLayer } from '@deck.gl/layers';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { act, renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { SatellitesProvider, useSatellites } from './satellites-context';
import { selectScene, setHoveredScene } from './satellites.slice';

const mockStore = configureMockStore();

/**
 * @param {Omit<import('./satellites-context').SatellitesProviderProps, 'children'>
 *  & import('./satellites.slice').SatellitesState
 * } [props]
 */
const renderContext = ({
  scenes,
  selectedScene,
  hoveredScene,
  ...rest
} = {}) => {
  const store = mockStore({
    satellites: { scenes, selectedScene, hoveredScene },
  });
  const utils = renderHook(() => useSatellites(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <SatellitesProvider {...rest}>{children}</SatellitesProvider>
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
      const { result } = renderContext({ defaultIsDrawingAoi: true });
      expect(result.current.drawAoiLayer).toBeInstanceOf(EditableGeoJsonLayer);
    });

    it("is returned when isDrawingAoi is false but there's a feature", () => {
      const { result } = renderContext({
        defaultFeatures: [{ id: '123', geometry: { coordinates: [] } }],
      });
      expect(result.current.drawAoiLayer).toBeInstanceOf(EditableGeoJsonLayer);
    });

    describe('onEdit', () => {
      it('Returns if editType is not addFeature', () => {
        const { result } = renderContext({
          defaultIsDrawingAoi: true,
          defaultFeatures: [{ geometry: { coordinates: [[123, 123]] } }],
        });
        act(() =>
          result.current.drawAoiLayer.props.onEdit({
            editType: 'somethingElse',
          }),
        );
        expect(result.current.aoi).toBeUndefined();
      });

      it('sets the aoi', () => {
        const { result } = renderContext({
          defaultIsDrawingAoi: true,
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
        expect(result.current.aoi).toEqual([123, 123]);
      });

      it('turns off isDrawingAoi', () => {
        const { result } = renderContext({
          defaultIsDrawingAoi: true,
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
        expect(result.current.isDrawingAoi).toBe(false);
      });
    });
  });

  describe('aoi', () => {
    it("is the first array of the feature's coordinates array", () => {
      const { result } = renderContext({
        defaultFeatures: [{ id: '123', geometry: { coordinates: ['345'] } }],
      });
      expect(result.current.aoi).toBe('345');
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
  });
});
