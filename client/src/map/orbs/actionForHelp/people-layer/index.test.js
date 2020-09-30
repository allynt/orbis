import { peopleLayer, TEXT_COLOR_TRANSPARENT, TEXT_COLOR_VISIBLE } from '.';

describe('peopleLayer', () => {
  let layer;

  beforeEach(() => {
    layer = peopleLayer({ id: 'test' });
  });

  describe('getIcon', () => {
    it("returns the feature's Type", () => {
      const feature = { properties: { Type: 'VOLUNTEER' } };
      const result = layer.props.getIcon(feature);
      expect(result).toBe(feature.properties.Type);
    });
  });

  describe('getIconSize', () => {
    it('returns 60 for a cluster', () => {
      const feature = { properties: { cluster: true } };
      const result = layer.props.getIconSize(feature);
      expect(result).toBe(60);
    });

    it('returns 15 for a person', () => {
      const feature = { properties: { Type: 'PERSON' } };
      const result = layer.props.getIconSize(feature);
      expect(result).toBe(15);
    });
  });

  describe('getTextColor', () => {
    it('returns transparent color if feature is a group', () => {
      const feature = { properties: { cluster: true, expansion_zoom: 5000 } };
      const result = layer.props.getTextColor(feature);
      expect(result).toEqual(TEXT_COLOR_TRANSPARENT);
    });

    it('returns visible color if feature is a cluster', () => {
      const feature = { properties: { cluster: true, expansion_zoom: 2 } };
      const result = layer.props.getTextColor(feature);
      expect(result).toEqual(TEXT_COLOR_VISIBLE);
    });
  });
});
