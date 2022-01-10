import { BitmapLayer } from '@deck.gl/layers';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { act, renderHook as tlRenderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { server } from 'mocks/server';

import { Panels } from './satellite.constants';
import {
  endDrawingSatelliteAoi,
  selectScene,
  setHoveredScene,
} from './satellites.slice';
import { useSatellitesLayers } from './useSatellitesLayers';

const mockStore = configureMockStore();

/**
 * @param {import('./satellites.slice').SatellitesState
 * } [state]
 */
const renderHook = (state = {}) => {
  const store = mockStore({
    satellites: {
      selectedSceneLayerVisible: false,
      ...state,
    },
  });
  const utils = tlRenderHook(() => useSatellitesLayers(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { ...utils, store };
};

describe('useSatellitesLayers', () => {
  describe('drawSatelliteAoiLayer', () => {
    it("is not returned when isDrawingSatelliteAoi is false and there's no feature", () => {
      const { result } = renderHook();
      expect(result.current.drawSatelliteAoiLayer).toBeUndefined();
    });

    it("is returned when isDrawingSatelliteAoi is true but there's no feature", () => {
      const { result } = renderHook({ isDrawingSatelliteAoi: true });
      expect(result.current.drawSatelliteAoiLayer).toBeInstanceOf(
        EditableGeoJsonLayer,
      );
    });

    it("is returned when isDrawingSatelliteAoi is false but there's a feature", () => {
      const { result } = renderHook({
        aoi: Array(4).fill([0, 0]),
      });
      expect(result.current.drawSatelliteAoiLayer).toBeInstanceOf(
        EditableGeoJsonLayer,
      );
    });

    it('is not visible when the visualisation panel is visible', () => {
      const { result } = renderHook({
        isDrawingSatelliteAoi: true,
        visiblePanel: Panels.VISUALISATION,
      });
      expect(result.current.drawSatelliteAoiLayer.props.visible).toBe(false);
    });

    describe('onEdit', () => {
      it('Returns if editType is not addFeature', () => {
        const { result, store } = renderHook({
          isDrawingSatelliteAoi: true,
        });
        act(() =>
          result.current.drawSatelliteAoiLayer.props.onEdit({
            editType: 'somethingElse',
          }),
        );
        expect(store.getActions()).toEqual([]);
      });

      it('sets the aoi', () => {
        const { result, store } = renderHook({
          isDrawingSatelliteAoi: true,
        });
        result.current.drawSatelliteAoiLayer.props.onEdit({
          editType: 'addFeature',
          updatedData: {
            features: [{ id: '123', geometry: { coordinates: [[123, 123]] } }],
          },
        });
        expect(store.getActions()).toContainEqual(
          endDrawingSatelliteAoi([123, 123]),
        );
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
      const { result } = renderHook({ scenes });
      expect(result.current.scenesLayer.props.data).toEqual(expected);
    });

    it.each([Panels.SEARCH, Panels.VISUALISATION])(
      'is not visible if the visible panel is %s',
      defaultPanel => {
        const { result } = renderHook({ defaultPanel });
        expect(result.current.scenesLayer.props.visible).toBe(false);
      },
    );

    describe('onClick', () => {
      it('Selects the clicked scene on click', () => {
        const scene = { id: 1 };
        const { result, store } = renderHook({ scenes: [scene] });
        result.current.scenesLayer.props.onClick({
          object: { properties: scene },
        });
        expect(store.getActions()).toContainEqual(selectScene(scene));
      });
    });

    describe('getLineWidth', () => {
      it('Returns 3 if the scene is hovered', () => {
        const scene = { id: 1, properties: { id: 1 } };
        const { result } = renderHook({ hoveredScene: scene });
        const value = result.current.scenesLayer.props.getLineWidth(scene);
        expect(value).toBe(3);
      });

      it('Returns 0 if the scene is not hovered', () => {
        const { result } = renderHook({
          hoveredScene: { id: 3 },
        });
        const value = result.current.scenesLayer.props.getLineWidth({
          properties: { id: 1 },
        });
        expect(value).toBe(0);
      });

      it('Returns 0 if hoveredScene is undefined', () => {
        const { result } = renderHook();
        const value = result.current.scenesLayer.props.getLineWidth({
          properties: { id: 1 },
        });
        expect(value).toBe(0);
      });
    });

    describe('onHover', () => {
      it('Dispatches the setHoveredScene action with the scene if present', () => {
        const scene = { id: 1, label: 'Hello' };
        const { result, store } = renderHook();
        result.current.scenesLayer.props.onHover({
          object: { properties: scene },
        });
        expect(store.getActions()).toContainEqual(setHoveredScene(scene));
      });

      it('Dispatches the setHoveredScene action with undefined when no scene is hovered', () => {
        const { result, store } = renderHook();
        result.current.scenesLayer.props.onHover({});
        expect(store.getActions()).toContainEqual(setHoveredScene(undefined));
      });
    });

    describe('getFilterValue', () => {
      it('Returns the cloud cover from the scene', () => {
        const cloudCover = 12345;
        const { result } = renderHook();
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
      server.use(
        rest.get('*/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ tiles: ['test-url'] }));
        }),
      );

      const { result, waitForNextUpdate } = renderHook({
        selectedScene: { id: '123', tile_url: '' },
      });
      await waitForNextUpdate();
      expect(result.current.selectedSceneLayer.props.data).toEqual([
        'test-url',
      ]);
    });

    it('Renders a BitmapLayer', async () => {
      const { result } = renderHook();
      expect(
        result.current.selectedSceneLayer.props.renderSubLayers({
          tile: { bbox: {} },
        }),
      ).toBeInstanceOf(BitmapLayer);
    });

    it.each([Panels.SEARCH, Panels.RESULTS])(
      'Is hidden if the visible panel is %s',
      defaultPanel => {
        const { result } = renderHook({ defaultPanel });
        expect(result.current.selectedSceneLayer.props.visible).toBe(false);
      },
    );
  });
});
