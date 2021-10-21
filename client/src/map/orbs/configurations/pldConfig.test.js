import configFn from './pldConfig';

const TEST_DATA = {
  features: [
    { properties: { 'Development Type': 'Conversion', Status: 'Approved' } },
    { properties: { 'Development Type': 'New Build', Status: 'Commenced' } },
    {
      properties: { 'Development Type': 'Change of Use', Status: 'Completed' },
    },
    { properties: { 'Development Type': 'Extension', Status: 'Approved' } },
  ],
};

const setup = ({
  filterValue = [],
  activeSources = [{ source_id: 'test/layer' }],
} = {}) => {
  const dispatch = jest.fn();
  const utils = configFn({
    id: 'test/layer',
    activeSources,
    orbState: {
      layers: {
        'test/layer': { filterValue, data: TEST_DATA },
      },
    },
  });

  return { ...utils, dispatch };
};

describe('PLD config', () => {
  describe('filtering', () => {
    it('returns all features if no filterValues present', () => {
      const { data } = setup();
      expect(data).toEqual(TEST_DATA);
    });

    it('filters by Development Type', () => {
      const expected = {
        features: [
          {
            properties: {
              'Development Type': 'New Build',
              Status: 'Commenced',
            },
          },
          {
            properties: {
              'Development Type': 'Change of Use',
              Status: 'Completed',
            },
          },
          {
            properties: { 'Development Type': 'Extension', Status: 'Approved' },
          },
        ],
      };

      const { data } = setup({
        filterValue: ['Conversion'],
      });

      expect(data).toEqual(expected);
    });

    it('filters by Status', () => {
      const expected = {
        features: [
          {
            properties: {
              'Development Type': 'Conversion',
              Status: 'Approved',
            },
          },
          {
            properties: {
              'Development Type': 'New Build',
              Status: 'Commenced',
            },
          },
          {
            properties: { 'Development Type': 'Extension', Status: 'Approved' },
          },
        ],
      };

      const { data } = setup({
        filterValue: ['Completed'],
      });

      expect(data).toEqual(expected);
    });

    it('filters by both simultaneously', () => {
      const expected = {
        features: [
          {
            properties: {
              'Development Type': 'New Build',
              Status: 'Commenced',
            },
          },
          {
            properties: { 'Development Type': 'Extension', Status: 'Approved' },
          },
        ],
      };

      const { data } = setup({
        filterValue: ['Conversion', 'Completed'],
      });

      expect(data).toEqual(expected);
    });
  });
});
