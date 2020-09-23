const { createTopMapStyle } = require('./mapStyle.utils');

describe('mapStyle.utils', () => {
  describe('createTopMapStyle', () => {
    it('returns the given map style with empty layers', () => {
      const mapStyle = {
        version: 1,
        layers: [{ id: 'one' }, { id: 'two' }],
      };
      const expected = {
        ...mapStyle,
        layers: [],
      };
      const result = createTopMapStyle(mapStyle);
      expect(result).toEqual(expected);
    });
  });
});
