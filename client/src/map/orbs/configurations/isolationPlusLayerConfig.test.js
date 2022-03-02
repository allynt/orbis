// @ts-nocheck

import {
  addClickedFeatures,
  removeClickedFeatures,
  setClickedFeatures,
  setHoveredFeatures,
  SHARED_STATE_KEY,
} from '../layers.slice';
import configFn, {
  LINE_WIDTH,
  LINE_WIDTH_SELECTED,
  COLOR_TRANSPARENT,
  OPACITY_FLAT,
  OPACITY_EXTRUDED_SELECTED,
  OPACITY_EXTRUDED,
  getValue,
} from './isolationPlusLayerConfig';

const source_id = 'source/1';
const setup = ({
  clickedFeatures,
  hoveredFeatures,
  extrudedMode = false,
  filterRange,
  property = {
    name: 'testProperty',
    min: 0,
    max: 1,
    clip_min: 0.5,
    type: 'continuous',
    application: { orbis: { display: { color: 'Spectral' } } },
  },
} = {}) => {
  const dispatch = jest.fn();
  const fns = configFn({
    dispatch,
    id: source_id,
    activeSources: [
      {
        source_id,
        authority: 'test',
        namespace: 'layer',
        metadata: {
          index: 'index',
          properties: [property],
        },
      },
    ],
    orbState: {
      layers: {
        extrudedMode,
        testProperty: {
          filterValue: filterRange,
        },
        [SHARED_STATE_KEY]: {
          other: {
            property: {
              source_id,
              ...property,
            },
          },
        },
        [source_id]: {
          clickedFeatures: clickedFeatures?.map(object => ({ object })),
          hoveredFeatures: hoveredFeatures?.map(object => ({ object })),
          data: [],
        },
      },
    },
    authTokens: {
      'test/layer': 'testAuthToken',
      'test/layer2': 'testAuthToken2',
    },
  });
  return { ...fns, dispatch };
};

describe('isolationPlusLayerConfig', () => {
  const FEATURE = {
    properties: { index: 'S0123', testProperty: 123 },
  };

  describe('getElevation', () => {
    it('returns the value of the selected property from the feature if no features are selected', () => {
      const { getElevation } = setup({ extrudedMode: true });
      expect(getElevation(FEATURE)).toBe(123);
    });

    it("returns the value of the selected property from the feature if some are selected and it's one of them", () => {
      const { getElevation } = setup({
        extrudedMode: true,
        clickedFeatures: [FEATURE],
      });
      expect(getElevation(FEATURE)).toBe(123);
    });

    it('returns 0 if there are selected features and its not one of them', () => {
      const { getElevation } = setup({
        clickedFeatures: [{ properties: { index: 'NotYours' } }],
      });
      expect(getElevation(FEATURE)).toBe(LINE_WIDTH);
    });

    it('Does not include getElevation if the property is discrete', () => {
      const { getElevation } = setup({ property: { type: 'discrete' } });
      expect(getElevation).toBe(undefined);
    });
  });

  describe('getLineWidth', () => {
    it(`returns ${LINE_WIDTH_SELECTED} if the area is selected`, () => {
      const { getLineWidth } = setup({ clickedFeatures: [FEATURE] });
      expect(getLineWidth(FEATURE)).toBe(LINE_WIDTH_SELECTED);
    });

    it(`returns ${LINE_WIDTH} if the area is not selected`, () => {
      const { getLineWidth } = setup();
      expect(getLineWidth(FEATURE)).toBe(LINE_WIDTH);
    });
  });

  describe('getFillColor', () => {
    it.each`
      value
      ${undefined}
      ${null}
      ${NaN}
    `(`returns ${COLOR_TRANSPARENT} when the value is $value`, ({ value }) => {
      const { getFillColor } = setup();
      expect(getFillColor({ properties: { testProperty: value } })).toEqual(
        COLOR_TRANSPARENT,
      );
    });

    it('returns the color from the scale for the given value', () => {
      const { getFillColor } = setup();
      expect(getFillColor({ properties: { testProperty: 0.5 } })).toEqual(
        expect.arrayContaining([158, 1, 66]),
      );
    });

    it(`Sets opacity to ${OPACITY_FLAT} if extruded mode is false`, () => {
      const { getFillColor } = setup();
      expect(getFillColor({ properties: { testProperty: 0.5 } })).toEqual(
        expect.arrayContaining([OPACITY_FLAT]),
      );
    });

    it(`Sets opacity to ${OPACITY_EXTRUDED_SELECTED} when extrudedMode is on but no areas are clicked`, () => {
      const { getFillColor } = setup({ extrudedMode: true });
      expect(getFillColor(FEATURE)).toEqual(
        expect.arrayContaining([OPACITY_EXTRUDED_SELECTED]),
      );
    });

    it(`Sets opacity to ${OPACITY_EXTRUDED_SELECTED} when extrudedMode is on and the feature is clicked`, () => {
      const { getFillColor } = setup({
        extrudedMode: true,
        clickedFeatures: [FEATURE],
      });
      expect(getFillColor(FEATURE)).toEqual(
        expect.arrayContaining([OPACITY_EXTRUDED_SELECTED]),
      );
    });

    it(`Sets opacity to ${OPACITY_EXTRUDED} when extrudedMode is on but the feature is not clicked`, () => {
      const { getFillColor } = setup({
        extrudedMode: true,
        clickedFeatures: [{ properties: { index: 'NotYours' } }],
      });
      expect(getFillColor(FEATURE)).toEqual(
        expect.arrayContaining([OPACITY_EXTRUDED]),
      );
    });

    it('Returns the given color for a discrete value', () => {
      const { getFillColor } = setup({
        property: {
          name: 'testProperty',
          type: 'discrete',
          categories: {
            banana: {
              color: 'yellow',
            },
            carrot: {
              color: 'orange',
            },
          },
        },
      });
      expect(getFillColor({ properties: { testProperty: 'carrot' } })).toEqual(
        expect.objectContaining([255, 165, 0]),
      );
    });

    it('returns white if feature is hovered', () => {
      const feature = {
        properties: {
          testProperty: true,
          index: 123,
        },
      };

      const hoveredFeatures = [feature];

      const { getFillColor } = setup({ hoveredFeatures });

      expect(getFillColor(feature)).toEqual(
        expect.arrayContaining([255, 255, 255]),
      );
    });
  });

  describe('onClick', () => {
    it.each`
      key       | eventObject
      ${'ctrl'} | ${{ srcEvent: { ctrlKey: true } }}
      ${'meta'} | ${{ srcEvent: { metaKey: true } }}
    `(
      `Dispatches the ${addClickedFeatures.type} action if the clicked area is new and $key is held`,
      ({ eventObject }) => {
        const info = { layer: { id: 'source/1', props: {} }, object: FEATURE };
        const { onClick, dispatch } = setup({
          clickedFeatures: [{ properties: { index: 'whatever' } }],
        });
        onClick(info, eventObject);
        expect(dispatch).toHaveBeenCalledWith(
          addClickedFeatures(
            expect.objectContaining({
              clickedFeatures: expect.arrayContaining([info]),
            }),
          ),
        );
      },
    );

    it(`Dispatches the ${setClickedFeatures.type} action if the clicked area is new and no modifier key is held`, () => {
      const info = { layer: { id: 'source/1', props: {} }, object: FEATURE };
      const { onClick, dispatch } = setup({
        clickedFeatures: [{ properties: { index: 'whatever' } }],
      });
      onClick(info, { srcEvent: {} });
      expect(dispatch).toHaveBeenCalledWith(
        setClickedFeatures(
          expect.objectContaining({
            clickedFeatures: expect.arrayContaining([info]),
          }),
        ),
      );
    });

    it.each`
      key       | eventObject
      ${'ctrl'} | ${{ srcEvent: { ctrlKey: true } }}
      ${'meta'} | ${{ srcEvent: { metaKey: true } }}
    `(
      `Dispatches the ${removeClickedFeatures.type} action if the clicked area is present and $key is held`,
      ({ eventObject }) => {
        const info = { layer: { id: 'source/1', props: {} }, object: FEATURE };
        const { onClick, dispatch } = setup({
          clickedFeatures: [FEATURE],
        });
        onClick(info, eventObject);
        expect(dispatch).toBeCalledWith(
          removeClickedFeatures(
            expect.objectContaining({ clickedFeatures: [info] }),
          ),
        );
      },
    );

    it(`Dispatches the ${setClickedFeatures.type} action clicked area is present and no modifier key is held`, () => {
      const info = { layer: { id: 'source/1', props: {} }, object: FEATURE };
      const { onClick, dispatch } = setup({
        clickedFeatures: [FEATURE],
      });
      onClick(info, { srcEvent: {} });
      expect(dispatch).toBeCalledWith(
        setClickedFeatures(
          expect.objectContaining({ clickedFeatures: [info] }),
        ),
      );
    });
  });

  describe('onHover', () => {
    it(`Dispatches the ${setHoveredFeatures.type} action if the area is hovered`, () => {
      const info = { layer: { id: source_id, props: {} }, object: FEATURE };
      const { onHover, dispatch } = setup();

      onHover(info);

      expect(dispatch).toHaveBeenCalledWith(
        setHoveredFeatures(
          expect.objectContaining({ hoveredFeatures: [info] }),
        ),
      );
    });

    it(`Dispatches the ${setHoveredFeatures.type} action with undefined if the area is hovered out`, () => {
      const { onHover, dispatch } = setup({ hoveredFeatures: [{}] });

      onHover({});

      expect(dispatch).toHaveBeenCalledWith(
        setHoveredFeatures({ key: source_id, hoveredFeatures: undefined }),
      );
    });
  });

  describe('getFilterValue', () => {
    it("Returns the feature's value multiplied by a scaling factor", () => {
      const { getFilterValue } = setup();
      expect(getFilterValue({ properties: { testProperty: 0.5 } })).toBe(500);
    });
  });

  describe('getValue', () => {
    it('returns the value if the property is not timeseries', () => {
      const result = getValue(
        { properties: { test: 'banana' } },
        { name: 'test', timeseries: false },
      );
      expect(result).toBe('banana');
    });

    it('returns the value of the latest timestamp if property is timeseries', () => {
      const result = getValue(
        {
          properties: {
            test: [
              { timestamp: '123', value: 'hi' },
              { timestamp: '456', value: 'nope' },
            ],
          },
        },
        { name: 'test', timeseries: true, timeseries_latest_timestamp: '123' },
      );
      expect(result).toBe('hi');
    });

    it('returns the value of the selected timestamp if present', () => {
      const result = getValue(
        {
          properties: {
            test: [
              { timestamp: '123', value: 'nope' },
              { timestamp: new Date(2020, 1, 1).toISOString(), value: 'hi' },
            ],
          },
        },
        { name: 'test', timeseries: true, timeseries_latest_timestamp: '123' },
        new Date(2020, 1, 1).getTime(),
      );
      expect(result).toBe('hi');
    });
  });
});
