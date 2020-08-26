const { infrastructureLayer } = require('.');

describe('infrastructureLayer', () => {
  let layer;

  beforeEach(() => {
    layer = infrastructureLayer({ id: 'test' });
  });

  describe('getIcon', () => {
    it('returns "cluster" for a cluster feature', () => {
      const feature = { properties: { cluster: true } };
      const result = layer.props.getIcon(feature);
      expect(result).toBe('cluster');
    });

    it('returns `type` for a location', () => {
      const feature = { properties: { type: 'hospital' } };
      const result = layer.props.getIcon(feature);
      expect(result).toBe(feature.properties.type);
    });
  });
});
