import { peopleLayer } from '.';

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
});
