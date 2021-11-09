import { hexToRgbArray } from 'utils/color';

import configFn, {
  DEFAULT_FILLED_COLOR,
  DEFAULT_LINE_COLOR,
  DEFAULT_HIGHLIGHT_COLOR,
} from './geoJsonConfig.js';

const FILLED_COLOR_RGB = hexToRgbArray(DEFAULT_FILLED_COLOR);
const STROKE_COLOR_RGB = hexToRgbArray(DEFAULT_LINE_COLOR);
const HIGHLIGHT_COLOR_RGB = hexToRgbArray(DEFAULT_HIGHLIGHT_COLOR);

const setup = ({
  filled,
  filledColor,
  stroked,
  outlineColor,
  pickable,
  highlightColor,
} = {}) =>
  configFn({
    isFilled: filled,
    filledColor,
    isOutlined: stroked,
    outlineColor,
    isHighlighted: pickable,
    highlightColor,
  });

describe('GeoJsonConfig', () => {
  describe('Filled Color', () => {
    it('test when no filled props supplied', () => {
      const { filled, getFillColor } = setup();

      expect(filled).toBe(true);
      expect(getFillColor()).toEqual(FILLED_COLOR_RGB);
    });

    it('test when filled is false and no filledColor supplied', () => {
      const { filled, getFillColor } = setup({ filled: false });

      expect(filled).toBe(false);
      expect(getFillColor()).toBeNull();
    });

    it('test visible with default color when filled is true and no filledColor supplied', () => {
      const { filled, getFillColor } = setup({ filled: true });

      expect(filled).toBe(true);
      expect(getFillColor()).toEqual(FILLED_COLOR_RGB);
    });

    it('test visible with default color when filled not set and filledColor supplied', () => {
      const testFilledColor = '#ffffff';

      const { filled, getFillColor } = setup({
        filledColor: testFilledColor,
      });

      expect(filled).toBe(true);
      expect(getFillColor()).not.toEqual(FILLED_COLOR_RGB);
      expect(getFillColor()).toEqual(hexToRgbArray(testFilledColor));
    });

    it('test visible with custom color when filled is true and filledColor supplied', () => {
      const testFilledColor = '#ffffff';

      const { filled, getFillColor } = setup({
        filled: true,
        filledColor: testFilledColor,
      });

      expect(filled).toBe(true);
      expect(getFillColor()).not.toEqual(FILLED_COLOR_RGB);
      expect(getFillColor()).toEqual(hexToRgbArray(testFilledColor));
    });

    it('test color is null when filled is false and filledColor supplied', () => {
      const testFilledColor = '#ffffff';

      const { filled, getFillColor } = setup({
        filled: false,
        testFilledColor,
      });

      expect(filled).toBe(false);
      expect(getFillColor()).not.toEqual(FILLED_COLOR_RGB);
      expect(getFillColor()).toBeNull();
    });
  });

  describe('Line Color', () => {
    it('test when no stroked props supplied', () => {
      const { stroked, getLineColor } = setup();

      expect(stroked).toBe(true);
      expect(getLineColor()).toEqual(STROKE_COLOR_RGB);
    });

    it('test when stroked is false and no outlineColor supplied', () => {
      const { stroked, getLineColor } = setup({ stroked: false });

      expect(stroked).toBe(false);
      expect(getLineColor()).toBeNull();
    });

    it('test visible with default color when stroked is true and no outlineColor supplied', () => {
      const { stroked, getLineColor } = setup({ stroked: true });

      expect(stroked).toBe(true);
      expect(getLineColor()).toEqual(STROKE_COLOR_RGB);
    });

    it('test visible with default color when stroked not set and outlineColor supplied', () => {
      const testColor = '#ffffff';

      const { stroked, getLineColor } = setup({
        outlineColor: testColor,
      });

      expect(stroked).toBe(true);
      expect(getLineColor()).not.toEqual(STROKE_COLOR_RGB);
      expect(getLineColor()).toEqual(hexToRgbArray(testColor));
    });

    it('test visible with custom color when stroked is true and outlineColor supplied', () => {
      const testColor = '#ffffff';

      const { stroked, getLineColor } = setup({
        stroked: true,
        outlineColor: testColor,
      });

      expect(stroked).toBe(true);
      expect(getLineColor()).not.toEqual(STROKE_COLOR_RGB);
      expect(getLineColor()).toEqual(hexToRgbArray(testColor));
    });

    it('test color is null when stroked is false and outlineColor supplied', () => {
      const testColor = '#ffffff';

      const { stroked, getLineColor } = setup({
        stroked: false,
        outlineColor: testColor,
      });

      expect(stroked).toBe(false);
      expect(getLineColor()).toBeNull();
    });
  });

  describe('Highlight Color', () => {
    it('test when no pickable props supplied', () => {
      const { pickable, highlightColor } = setup();

      expect(pickable).toBe(true);
      expect(highlightColor()).toEqual(HIGHLIGHT_COLOR_RGB);
    });

    it('test when pickable is false and no highlightColor supplied', () => {
      const { pickable, highlightColor } = setup({
        pickable: false,
      });

      expect(pickable).toBe(false);
      expect(highlightColor()).not.toEqual(HIGHLIGHT_COLOR_RGB);
      expect(highlightColor()).toBeNull();
    });

    it('test visible with default color when pickable is true and no highlightColor supplied', () => {
      const { pickable, highlightColor } = setup({ pickable: true });

      expect(pickable).toBe(true);
      expect(highlightColor()).toEqual(HIGHLIGHT_COLOR_RGB);
    });

    it('test visible with custom color when pickable is true and highlightColor supplied', () => {
      const testHighLightColor = '#ffffff';

      const { pickable, highlightColor } = setup({
        pickable: true,
        highlightColor: testHighLightColor,
      });

      expect(pickable).toBe(true);
      expect(highlightColor()).not.toEqual(HIGHLIGHT_COLOR_RGB);
      expect(highlightColor()).toEqual(hexToRgbArray(testHighLightColor));
    });

    it('test highlighted invisible when pickable set false and highlightColor supplied', () => {
      const testHighLightColor = '#ffffff';

      const { pickable, highlightColor } = setup({
        pickable: false,
        highlightColor: testHighLightColor,
      });

      expect(pickable).toBe(false);
      expect(highlightColor()).not.toEqual(hexToRgbArray(testHighLightColor));
      expect(highlightColor()).toBeNull();
    });
  });
});
