// @ts-nocheck

import { MAX_ZOOM } from 'map/map.constants';

import { setClickedFeatures, setHoveredFeatures } from '../layers.slice';
import configFn from './pinIconConfig';

const setup = ({
  state = {},
  filterData = undefined,
  activeSources = [{ source_id: 'test/layer' }],
  onGroupHover,
  onPointHover,
  onGroupClick,
  onPointClick,
} = {}) => {
  const dispatch = jest.fn();
  const setViewState = jest.fn();
  const utils = configFn({
    id: 'test/layer',
    filterData,
    activeSources,
    dispatch,
    setViewState,
    onGroupHover,
    onPointHover,
    onGroupClick,
    onPointClick,
    orbState: {
      layers: {
        'test/layer': state,
      },
    },
  });
  return { ...utils, dispatch, setViewState };
};

describe('pinIconConfig', () => {
  describe('filterData', () => {
    it('uses prop data if present', () => {
      const testData = [{ name: 'test-feature' }];
      const { data } = setup({ filterData: testData });

      expect(data).toEqual(testData);
    });
  });

  describe('visible', () => {
    it('is true if the layer is visible in state and the layer is active', () => {
      const { visible } = setup({ state: { visible: true } });
      expect(visible).toBe(true);
    });

    it('is false if the layer is not visible in state', () => {
      const { visible } = setup({ state: { visible: false } });
      expect(visible).toBe(false);
    });

    it('is false if the source is not active', () => {
      const { visible } = setup({
        state: { visible: true },
        activeSources: [],
      });
      expect(visible).toBe(false);
    });
  });

  describe('onHover', () => {
    describe('onGroupHover', () => {
      const info = {
        object: {
          properties: {
            cluster: true,
            expansion_zoom: MAX_ZOOM + 1,
          },
        },
        objects: ['hello', 'there'],
      };
      it('Calls the passed onGroupHover if present', () => {
        const onGroupHover = jest.fn();
        const { onHover } = setup({ onGroupHover });
        onHover(info);
        expect(onGroupHover).toHaveBeenCalledWith(info.objects);
      });

      it(`Dispatches ${setHoveredFeatures.type} action if onGroupHover is true`, () => {
        const { onHover, dispatch } = setup({ onGroupHover: true });
        onHover(info);
        expect(dispatch).toHaveBeenCalledWith(
          setHoveredFeatures(
            expect.objectContaining({ hoveredFeatures: info.objects }),
          ),
        );
      });
    });

    describe('onPointHover', () => {
      const info = {
        object: {
          properties: {
            test: 'hello',
          },
        },
      };
      it('Calls the passed onPointHover if present', () => {
        const onPointHover = jest.fn();
        const { onHover } = setup({ onPointHover });
        onHover(info);
        expect(onPointHover).toHaveBeenCalledWith([info.object]);
      });

      it(`Dispatches ${setHoveredFeatures.type} action if onPointHover is true`, () => {
        const { onHover, dispatch } = setup({ onPointHover: true });
        onHover(info);
        expect(dispatch).toBeCalledWith(
          setHoveredFeatures(
            expect.objectContaining({ hoveredFeatures: [info.object] }),
          ),
        );
      });
    });
  });

  describe('onClick', () => {
    it(`Calls setViewState if the feature is a cluster and expansion_zoom is less than or equal to ${MAX_ZOOM}`, () => {
      const info = {
        object: {
          geometry: {
            coordinates: [1, 2],
          },
          properties: {
            cluster: true,
            expansion_zoom: MAX_ZOOM - 10,
          },
        },
      };
      const { setViewState, onClick } = setup();
      onClick(info);
      expect(setViewState).toHaveBeenCalledWith(
        expect.objectContaining({ longitude: 1, latitude: 2 }),
      );
    });

    describe('onGroupClick', () => {
      const info = {
        object: {
          properties: {
            cluster: true,
            expansion_zoom: MAX_ZOOM + 10,
          },
        },
        objects: ['hello', 'there'],
      };

      it('Calls the passed onGroupClick if present', () => {
        const onGroupClick = jest.fn();
        const { onClick } = setup({ onGroupClick });
        onClick(info);
        expect(onGroupClick).toHaveBeenCalledWith(info.objects);
      });

      it(`Dispatches ${setClickedFeatures.type} action if onGroupClick is true`, () => {
        const { onClick, dispatch } = setup({ onGroupClick: true });
        onClick(info);
        expect(dispatch).toHaveBeenCalledWith(
          setClickedFeatures(
            expect.objectContaining({ clickedFeatures: info.objects }),
          ),
        );
      });
    });

    describe('onPointClick', () => {
      const info = {
        object: {
          properties: {
            test: 'hello',
          },
        },
      };
      it('Calls the passed onPointClick if present', () => {
        const onPointClick = jest.fn();
        const { onClick } = setup({ onPointClick });
        onClick(info);
        expect(onPointClick).toHaveBeenCalledWith([info.object]);
      });

      it(`Dispatches ${setClickedFeatures.type} action if onPointClick is true`, () => {
        const { onClick, dispatch } = setup({ onPointClick: true });
        onClick(info);
        expect(dispatch).toHaveBeenCalledWith(
          setClickedFeatures(
            expect.objectContaining({ clickedFeatures: [info.object] }),
          ),
        );
      });
    });
  });
});
