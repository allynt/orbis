import { hexToRgbArray } from 'utils/color';

import geoJsonLayer, {
  DEFAULT_FILLED_COLOR,
  DEFAULT_LINE_COLOR,
} from './geoJsonConfig.js';

const DEFAULT_FILL_COLOR = hexToRgbArray(DEFAULT_FILLED_COLOR);
const DEFAULT_STROKE_COLOR = hexToRgbArray(DEFAULT_LINE_COLOR);

const setup = ({ filled, filledColor } = {}) =>
  geoJsonLayer({ filled, filledColor });

describe('GeoJsonConfig', () => {
  describe('Filled Color', () => {
    it('test when no fill props supplied', () => {
      const { filled, getFillColor } = setup();

      expect(filled).toBe(true);
      expect(getFillColor()).toEqual(DEFAULT_FILL_COLOR);
    });

    it('test when filled is false and no filledColor supplied', () => {
      const { filled, getFillColor } = setup({ filled: false });

      expect(filled).toBe(false);
      expect(getFillColor()).toBeNull();
    });

    it('test visible with default color when filled is true and no fillColor supplied', () => {
      const { filled, getFillColor } = setup({ filled: true });

      expect(filled).toBe(true);
      expect(getFillColor()).toEqual(DEFAULT_FILL_COLOR);
    });

    it('test visible with default color when filled not set and fillColor supplied', () => {
      const filledColor = '#ffffff';

      const { filled, getFillColor } = setup({ filledColor });

      expect(filled).toBe(true);
      expect(getFillColor()).not.toEqual(DEFAULT_FILL_COLOR);
      expect(getFillColor()).toEqual(hexToRgbArray(filledColor));
    });

    it('test visible with custom color when filled is true and fillColor supplied', () => {
      const filledColor = '#ffffff';

      const { filled, getFillColor } = setup({
        filled: true,
        filledColor,
      });

      expect(filled).toBe(true);
      expect(getFillColor()).not.toEqual(DEFAULT_FILL_COLOR);
      expect(getFillColor()).toEqual(hexToRgbArray(filledColor));
    });

    it('test color is null when filled is false and fillColor supplied', () => {
      const filledColor = '#ffffff';

      const { filled, getFillColor } = setup({
        filled: false,
        filledColor,
      });

      expect(filled).toBe(false);
      expect(getFillColor()).not.toEqual(DEFAULT_FILL_COLOR);
      expect(getFillColor()).toBeNull();
    });
  });

  describe('Line Color', () => {
    it('test when no fill props supplied', () => {
      const { stroked, getLineColor } = setup();

      expect(stroked).toBe(true);
      expect(getLineColor()).toEqual(DEFAULT_STROKE_COLOR);
    });
  });
});
