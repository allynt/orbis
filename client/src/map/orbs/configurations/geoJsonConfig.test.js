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
  isFilled,
  outlined,
  isOutlined,
  isHighlighted,
  highlighted,
} = {}) =>
  configFn({
    filled,
    isFilled,
    outlined,
    isOutlined,
    isHighlighted,
    highlighted,
  });

describe('GeoJsonConfig', () => {
  describe('Filled Color', () => {
    it('test when no isFilled props supplied', () => {
      const { isFilled, getFillColor } = setup();

      expect(isFilled).toBe(true);
      expect(getFillColor()).toEqual(FILLED_COLOR_RGB);
    });

    it('test when isFilled is false and no filled supplied', () => {
      const { isFilled, getFillColor } = setup({ isFilled: false });

      expect(isFilled).toBe(false);
      expect(getFillColor()).toBeNull();
    });

    it('test visible with default color when isFilled is true and no fill supplied', () => {
      const { isFilled, getFillColor } = setup({ isFilled: true });

      expect(isFilled).toBe(true);
      expect(getFillColor()).toEqual(FILLED_COLOR_RGB);
    });

    it('test visible with default color when isFilled not set and filled supplied', () => {
      const filled = '#ffffff';

      const { isFilled, getFillColor } = setup({ filled });

      expect(isFilled).toBe(true);
      expect(getFillColor()).not.toEqual(FILLED_COLOR_RGB);
      expect(getFillColor()).toEqual(hexToRgbArray(filled));
    });

    it('test visible with custom color when isFilled is true and filled supplied', () => {
      const filled = '#ffffff';

      const { isFilled, getFillColor } = setup({
        isFilled: true,
        filled,
      });

      expect(isFilled).toBe(true);
      expect(getFillColor()).not.toEqual(FILLED_COLOR_RGB);
      expect(getFillColor()).toEqual(hexToRgbArray(filled));
    });

    it('test color is null when isFilled is false and filled supplied', () => {
      const filled = '#ffffff';

      const { isFilled, getFillColor } = setup({
        isFilled: false,
        filled,
      });

      expect(isFilled).toBe(false);
      expect(getFillColor()).not.toEqual(FILLED_COLOR_RGB);
      expect(getFillColor()).toBeNull();
    });
  });

  describe('Line Color', () => {
    it('test when no isOutlined props supplied', () => {
      const { isOutlined, getLineColor } = setup();

      expect(isOutlined).toBe(true);
      expect(getLineColor()).toEqual(STROKE_COLOR_RGB);
    });

    it('test when isOutlined is false and no outlined supplied', () => {
      const { isOutlined, getLineColor } = setup({ isOutlined: false });

      expect(isOutlined).toBe(false);
      expect(getLineColor()).toBeNull();
    });

    it('test visible with default color when isOutlined is true and no outlined supplied', () => {
      const { isOutlined, getLineColor } = setup({ isOutlined: true });

      expect(isOutlined).toBe(true);
      expect(getLineColor()).toEqual(STROKE_COLOR_RGB);
    });

    it('test visible with default color when isOutlined not set and outlined supplied', () => {
      const testColor = '#ffffff';

      const { isOutlined, getLineColor } = setup({ outlined: testColor });

      expect(isOutlined).toBe(true);
      expect(getLineColor()).not.toEqual(STROKE_COLOR_RGB);
      expect(getLineColor()).toEqual(hexToRgbArray(testColor));
    });

    it('test visible with custom color when isOutlined is true and outlined supplied', () => {
      const testColor = '#ffffff';

      const { isOutlined, getLineColor } = setup({
        isOutlined: true,
        outlined: testColor,
      });

      expect(isOutlined).toBe(true);
      expect(getLineColor()).not.toEqual(STROKE_COLOR_RGB);
      expect(getLineColor()).toEqual(hexToRgbArray(testColor));
    });

    it('test color is null when isOutlined is false and outlined supplied', () => {
      const testColor = '#ffffff';

      const { isOutlined, getLineColor } = setup({
        isOutlined: false,
        testColor,
      });

      expect(isOutlined).toBe(false);
      expect(getLineColor()).toBeNull();
    });
  });

  describe('Highlight Color', () => {
    it('test when no isHighlighted props supplied', () => {
      const { isHighlighted, highlightColor } = setup();

      expect(isHighlighted).toBe(true);
      expect(highlightColor()).toEqual(HIGHLIGHT_COLOR_RGB);
    });

    it('test when isHighlighted is false and no highlighted supplied', () => {
      const { isHighlighted, highlightColor } = setup({
        isHighlighted: false,
      });

      expect(isHighlighted).toBe(false);
      expect(highlightColor()).not.toEqual(HIGHLIGHT_COLOR_RGB);
      expect(highlightColor()).toBeNull();
    });

    it('test visible with default color when isHighlighted is true and no highlighted supplied', () => {
      const { isHighlighted, highlightColor } = setup({ isHighlighted: true });

      expect(isHighlighted).toBe(true);
      expect(highlightColor()).toEqual(HIGHLIGHT_COLOR_RGB);
    });

    it('test visible with custom color when isHighlighted is true and highlighted supplied', () => {
      const testHighLightColor = '#ffffff';

      const { isHighlighted, highlightColor } = setup({
        isHighlighted: true,
        highlighted: testHighLightColor,
      });

      expect(isHighlighted).toBe(true);
      expect(highlightColor()).not.toEqual(HIGHLIGHT_COLOR_RGB);
      expect(highlightColor()).toEqual(hexToRgbArray(testHighLightColor));
    });

    it('test isHighlighted invisible when isHighlighted set false and highlighted supplied', () => {
      const testHighLightColor = '#ffffff';

      const { isHighlighted, highlightColor } = setup({
        isHighlighted: false,
        highlighted: testHighLightColor,
      });

      expect(isHighlighted).toBe(false);
      expect(highlightColor()).not.toEqual(hexToRgbArray(testHighLightColor));
      expect(highlightColor()).toBeNull();
    });
  });
});
