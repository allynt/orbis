import { peopleLayer, TEXT_COLOR_TRANSPARENT, TEXT_COLOR_VISIBLE } from '.';

describe('peopleLayer', () => {
  let layer;

  beforeEach(() => {
    layer = peopleLayer({ id: 'test' });
  });

  describe('getIcon', () => {
    it('returns "cluster" if the feature is a cluster and its expansion zoom is less than the max zoom', () => {
      const feature = { properties: { cluster: true, expansion_zoom: 3 } };
      const result = layer.props.getIcon(feature);
      expect(result).toBe('cluster');
    });

    it('returns "group" if the feature is a cluster and the expansion_zoom is greater than MAX_ZOOM', () => {
      const feature = { properties: { cluster: true, expansion_zoom: 5000 } };
      const result = layer.props.getIcon(feature);
      expect(result).toBe('group');
    });

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
