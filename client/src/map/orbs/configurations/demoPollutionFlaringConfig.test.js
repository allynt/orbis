import configFn from './demoPollutionFlaringConfig';

describe('demoPollutionFlaringConfig', () => {
  describe('data', () => {
    it('returns all features from data if other does not exist', () => {
      const { data } = configFn({
        id: 'test/layer',
        orbState: {
          layers: { 'test/layer': { data: { features: [1, 2] } } },
        },
      });
      expect(data).toEqual([1, 2]);
    });

    it('returns all features from data if other.date does not exist', () => {
      const { data } = configFn({
        id: 'test/layer',
        orbState: {
          layers: { 'test/layer': { data: { features: [1, 2] }, other: {} } },
        },
      });
      expect(data).toEqual([1, 2]);
    });
  });

  describe('getPosition', () => {
    it('returns feature.geometry.coordinates', () => {
      const { getPosition } = configFn({});
      expect(getPosition({ geometry: { coordinates: [1, 2] } })).toEqual([
        1,
        2,
      ]);
    });
  });

  describe('getFilterValue', () => {
    it('Returns 1 if the features timestamp includes the given date', () => {
      const feature = {
        properties: { id: 2, timestamp: '2020-01-01 23:00:00' },
      };
      const { getFilterValue } = configFn({
        id: 'test/layer',
        orbState: {
          layers: {
            'test/layer': {
              other: { date: 1577923200000 },
            },
          },
        },
      });
      expect(getFilterValue(feature)).toBe(1);
    });
  });
});
