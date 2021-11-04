import { hexToRgbArray } from 'utils/color';

import geoJsonLayer, {
  DEFAULT_FILLED_COLOR,
  DEFAULT_LINE_COLOR,
  DEFAULT_HIGHLIGHT_COLOR,
} from './geoJsonConfig.js';

const DEFAULT_FILL_COLOR = hexToRgbArray(DEFAULT_FILLED_COLOR);
const DEFAULT_STROKE_COLOR = hexToRgbArray(DEFAULT_LINE_COLOR);
const DEFAULT_HIGHLIGHTED_COLOR = hexToRgbArray(DEFAULT_HIGHLIGHT_COLOR);

const setup = ({
  filled,
  filledColor,
  lineColor,
  stroked,
  pickable,
  highlightColor,
} = {}) =>
  geoJsonLayer({
    filled,
    filledColor,
    lineColor,
    stroked,
    pickable,
    highlightColor,
  });

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
    it('test when no stroked props supplied', () => {
      const { stroked, getLineColor } = setup();

      expect(stroked).toBe(true);
      expect(getLineColor()).toEqual(DEFAULT_STROKE_COLOR);
    });

    it('test when stroke is false and no lineColor supplied', () => {
      const { stroked, getLineColor } = setup({ stroked: false });

      expect(stroked).toBe(false);
      expect(getLineColor()).toBeUndefined();
    });

    it('test visible with default color when stroked is true and no lineColor supplied', () => {
      const { stroked, getLineColor } = setup({ stroked: true });

      expect(stroked).toBe(true);
      expect(getLineColor()).toEqual(DEFAULT_STROKE_COLOR);
    });

    it('test visible with default color when stroke not set and lineColor supplied', () => {
      const lineColor = '#ffffff';
      const { stroked, getLineColor } = setup({ lineColor });
      expect(stroked).toBe(true);
      expect(getLineColor()).not.toEqual(DEFAULT_STROKE_COLOR);
      expect(getLineColor()).toEqual(hexToRgbArray(lineColor));
    });

    it('test visible with custom color when stroke is true and lineColor supplied', () => {
      const lineColor = '#ffffff';

      const { stroked, getLineColor } = setup({
        stroked: true,
        lineColor,
      });

      expect(stroked).toBe(true);
      expect(getLineColor()).not.toEqual(DEFAULT_STROKE_COLOR);
      expect(getLineColor()).toEqual(hexToRgbArray(lineColor));
    });

    it('test color is undefined when stroked is false and lineColor supplied', () => {
      const lineColor = '#ffffff';

      const { stroked, getLineColor } = setup({
        stroked: false,
        lineColor,
      });

      expect(stroked).toBe(false);
      expect(getLineColor()).toBeUndefined();
    });
  });

  describe('Highlight Color', () => {
    it('test when no pickable props supplied', () => {
      const { pickable, highlightColor } = setup();

      expect(pickable).toBe(undefined);
      expect(highlightColor).toEqual(DEFAULT_HIGHLIGHTED_COLOR);
    });

    // it('test when pickable is false and no highlightColor supplied', () => {
    //   const { pickable, highlightColor } = setup({
    //     pickable: false,
    //   });

    //   expect(pickable).toBe(false);
    //   expect(highlightColor).not.toEqual(DEFAULT_HIGHLIGHTED_COLOR);
    //   expect(highlightColor).toBeNull();
    // });

    it('test visible with default color when pickable is true and no highlightColor supplied', () => {
      const { pickable, highlightColor } = setup({ pickable: true });

      expect(pickable).toBe(true);
      expect(highlightColor).toEqual(DEFAULT_HIGHLIGHTED_COLOR);
    });

    // it('test visible with custom color when pickable is true and highlightColor supplied', () => {
    //   const newHighLightColor1 = '#ffffff';

    //   const { pickable, highlightColor } = setup({
    //     pickable: true,
    //     newHighLightColor,
    //   });

    //   expect(pickable).toBe(true);
    //   expect(highlightColor).not.toEqual(DEFAULT_FILL_COLOR);
    //   expect(highlightColor).toEqual(hexToRgbArray(newHighLightColor));
    // });

    // it('test highLightColor invisible when pickable set false and highLightColor supplied', () => {
    //   const newHighLightColor = '#ffffff';

    //   const { pickable, highlightColor } = setup({
    //     pickable: false,
    //     newHighLightColor,
    //   });

    //   expect(pickable).toBe(false);
    //   expect(highlightColor).not.toEqual(newHighLightColor);
    //   expect(highlightColor).toBeNull();
    // });
  });
});
