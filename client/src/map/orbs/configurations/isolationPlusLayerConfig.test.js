// @ts-nocheck

import {
  addClickedFeatures,
  removeClickedFeatures,
  setClickedFeatures,
} from '../slices/isolation-plus.slice';
import configFn, {
  LINE_WIDTH,
  LINE_WIDTH_SELECTED,
  COLOR_TRANSPARENT,
  OPACITY_FLAT,
  OPACITY_EXTRUDED_SELECTED,
  OPACITY_EXTRUDED,
} from './isolationPlusLayerConfig';

const setup = ({ clickedFeatures, extrudedMode = false } = {}) => {
  const dispatch = jest.fn();
  const fns = configFn({
    dispatch,
    id: 'source/1',
    activeSources: [
      {
        source_id: 'source/1',
        metadata: {
          properties: [
            {
              name: 'testProperty',
              min: 0,
              max: 1,
              clip_min: 0.5,
              application: { orbis: { display: { color: 'Spectral' } } },
            },
          ],
        },
      },
    ],
    orbState: {
      layers: {
        extrudedMode,
      },
      isolationPlus: {
        property: {
          name: 'testProperty',
        },
        clickedFeatures: clickedFeatures?.map(object => ({ object })),
      },
    },
  });
  return { ...fns, dispatch };
};

describe('isolationPlusLayerConfig', () => {
  const FEATURE = { properties: { index: 'S0123', testProperty: 123 } };

  describe('getElevation', () => {
    it('returns the value of the selected property from the feature if no features are selected', () => {
      const { getElevation } = setup();
      expect(getElevation(FEATURE)).toBe(123);
    });

    it("returns the value of the selected property from the feature if some are selected and it's one of them", () => {
      const { getElevation } = setup({
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
  });

  describe('onClick', () => {
    it.each`
      key       | eventObject
      ${'ctrl'} | ${{ srcEvent: { ctrlKey: true } }}
      ${'meta'} | ${{ srcEvent: { metaKey: true } }}
    `(
      `Dispatches the ${addClickedFeatures.type} action if the clicked area is new and $key is held`,
      ({ eventObject }) => {
        const info = { object: FEATURE };
        const { onClick, dispatch } = setup({
          clickedFeatures: [{ properties: { index: 'whatever' } }],
        });
        onClick(info, eventObject);
        expect(dispatch).toHaveBeenCalledWith(
          addClickedFeatures(expect.arrayContaining([info])),
        );
      },
    );

    it(`Dispatches the ${setClickedFeatures.type} action if the clicked area is new and no modifier key is held`, () => {
      const info = { object: FEATURE };
      const { onClick, dispatch } = setup({
        clickedFeatures: [{ properties: { index: 'whatever' } }],
      });
      onClick(info, { srcEvent: {} });
      expect(dispatch).toHaveBeenCalledWith(
        setClickedFeatures(expect.arrayContaining([info])),
      );
    });

    it.each`
      key       | eventObject
      ${'ctrl'} | ${{ srcEvent: { ctrlKey: true } }}
      ${'meta'} | ${{ srcEvent: { metaKey: true } }}
    `(
      `Dispatches the ${removeClickedFeatures.type} action if the clicked area is present and $key is held`,
      ({ eventObject }) => {
        const info = { object: FEATURE };
        const { onClick, dispatch } = setup({
          clickedFeatures: [FEATURE],
        });
        onClick(info, eventObject);
        expect(dispatch).toBeCalledWith(removeClickedFeatures([info]));
      },
    );

    it(`Dispatches the ${setClickedFeatures.type} action clicked area is present and no modifier key is held`, () => {
      const info = { object: FEATURE };
      const { onClick, dispatch } = setup({
        clickedFeatures: [FEATURE],
      });
      onClick(info, { srcEvent: {} });
      expect(dispatch).toBeCalledWith(setClickedFeatures([info]));
    });
  });

  describe('getFilterValue', () => {
    it("Returns the feature's value rounded", () => {
      const { getFilterValue } = setup();
      expect(getFilterValue({ properties: { testProperty: 0.5 } })).toBe(1);
    });
  });
});
