import configFn from './pldConfig';

const TEST_DATA = {
  features: [
    {
      properties: {
        'Development Type': 'Conversion',
        Status: 'Approved',
        decision_date: '2020-01-01T15:00:00.000Z',
      },
    },
    {
      properties: {
        'Development Type': 'New Build',
        Status: 'Commenced',
        decision_date: '2020-02-01T15:00:00.000Z',
      },
    },
    {
      properties: {
        'Development Type': 'Change of Use',
        Status: 'Completed',
        decision_date: '2020-03-01T15:00:00.000Z',
      },
    },
    {
      properties: {
        'Development Type': 'Extension',
        Status: 'Approved',
        decision_date: '2020-04-01T15:00:00.000Z',
      },
    },
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

    it('filters by decision_date', () => {
      const expected = {
        features: [
          {
            properties: {
              'Development Type': 'New Build',
              Status: 'Commenced',
              decision_date: '2020-02-01T15:00:00.000Z',
            },
          },
          {
            properties: {
              'Development Type': 'Change of Use',
              Status: 'Completed',
              decision_date: '2020-03-01T15:00:00.000Z',
            },
          },
          {
            properties: {
              'Development Type': 'Extension',
              Status: 'Approved',
              decision_date: '2020-04-01T15:00:00.000Z',
            },
          },
        ],
      };

      const { data } = setup({
        filterValue: {
          dateRange: {
            startDate: '2020-02-01T15:00:00.000Z',
            endDate: '2020-10-01T15:00:00.000Z',
          },
        },
      });

      expect(data).toEqual(expected);
    });

    it('filters by Development Type', () => {
      const expected = {
        features: [
          {
            properties: {
              'Development Type': 'New Build',
              Status: 'Commenced',
              decision_date: '2020-02-01T15:00:00.000Z',
            },
          },
          {
            properties: {
              'Development Type': 'Change of Use',
              Status: 'Completed',
              decision_date: '2020-03-01T15:00:00.000Z',
            },
          },
          {
            properties: {
              'Development Type': 'Extension',
              Status: 'Approved',
              decision_date: '2020-04-01T15:00:00.000Z',
            },
          },
        ],
      };

      const { data } = setup({
        filterValue: { developmentType: ['Conversion'] },
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
              decision_date: '2020-01-01T15:00:00.000Z',
            },
          },
          {
            properties: {
              'Development Type': 'New Build',
              Status: 'Commenced',
              decision_date: '2020-02-01T15:00:00.000Z',
            },
          },
          {
            properties: {
              'Development Type': 'Extension',
              Status: 'Approved',
              decision_date: '2020-04-01T15:00:00.000Z',
            },
          },
        ],
      };

      const { data } = setup({
        filterValue: { constructionPhase: ['Completed'] },
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
              decision_date: '2020-02-01T15:00:00.000Z',
            },
          },
          {
            properties: {
              'Development Type': 'Extension',
              Status: 'Approved',
              decision_date: '2020-04-01T15:00:00.000Z',
            },
          },
        ],
      };

      const { data } = setup({
        filterValue: {
          constructionPhase: ['Completed'],
          developmentType: ['Conversion'],
        },
      });

      expect(data).toEqual(expected);
    });
  });
});
