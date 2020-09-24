const { createTopMapStyle, createBottomMapStyle } = require('./mapStyle.utils');

const TEST_MAP_STYLE = {
  version: 1,
  layers: [
    {
      id: 'label',
    },
    { id: 'road' },
  ],
};

describe('mapStyle.utils', () => {
  describe('createTopMapStyle', () => {
    it('returns the given map style containing layers which match the given top map layer groups', () => {
      const expected = {
        ...TEST_MAP_STYLE,
        layers: [{ id: 'label' }],
      };
      const result = createTopMapStyle(TEST_MAP_STYLE, ['label']);
      expect(result).toEqual(expected);
    });

    it('does not include layers which are not specified in the topMapLayerGroups array', () => {
      const result = createTopMapStyle(TEST_MAP_STYLE, ['label']);
      expect(result.layers).not.toContain({ id: 'road' });
    });

    it('returns the map style with an empty layers array if `topMapLayerGroups` is empty', () => {
      const expected = {
        ...TEST_MAP_STYLE,
        layers: [],
      };
      const result = createTopMapStyle(TEST_MAP_STYLE, []);
      expect(result).toEqual(expected);
    });
  });

  describe('createBottomMapStyle', () => {
    it('returns layers which are not specified in topMapLayerGroups', () => {
      const expected = {
        ...TEST_MAP_STYLE,
        layers: [{ id: 'road' }],
      };
      const result = createBottomMapStyle(TEST_MAP_STYLE, ['label']);
      expect(result).toEqual(expected);
    });

    it('does not include layers specified for the top map', () => {
      const result = createBottomMapStyle(TEST_MAP_STYLE, ['label']);
      expect(result.layers).not.toContain({ id: 'label' });
    });

    it('returns the complete style if topMapLayerGroups is empty', () => {
      const result = createBottomMapStyle(TEST_MAP_STYLE, []);
      expect(result).toEqual(TEST_MAP_STYLE);
    });
  });
});
