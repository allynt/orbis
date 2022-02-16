import { tenureHousingTransformer } from './tenure-housing-transformer';

jest.mock('dashboard/WalthamForest/waltham.constants', () => ({
  housingTenureTypes: {
    market: 'Market',
    intermediate: 'Intermediate',
  },
}));

const dataArray = [
  {
    title: 'transforms API and target data into correct data shape',
    data: [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
      {
        Year: '2016-2017',
        Market: 789,
        Intermediate: 101,
      },
    ],
    targets: {
      '2015-2016': '181',
      '2016-2017': '155',
    },
    expected: {
      transformedData: [
        {
          Year: '2015-2016',
          Market: 123,
          Intermediate: 456,
        },
        {
          Year: '2016-2017',
          Market: 789,
          Intermediate: 101,
        },
      ],
      transformedTargets: [
        { x: '2015-2016', y: 181 },
        { x: '2016-2017', y: 155 },
      ],
    },
  },
  {
    title: 'pads null values if there are missing years',
    data: [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
      {
        Year: '2016-2017',
        Market: 789,
        Intermediate: 101,
      },
    ],
    targets: {
      '2014-2015': '181',
      '2015-2016': '155',
    },
    expected: {
      transformedData: [
        { Year: '2014-2015', Market: null, Intermediate: null },
        {
          Year: '2015-2016',
          Market: 123,
          Intermediate: 456,
        },
        {
          Year: '2016-2017',
          Market: 789,
          Intermediate: 101,
        },
      ],
      transformedTargets: [
        { x: '2014-2015', y: 181 },
        { x: '2015-2016', y: 155 },
      ],
    },
  },
  {
    title: 'only returns data as high as latest year in api data',
    data: [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
    ],
    targets: {
      '2015-2016': '181',
      '2016-2017': '155',
    },
    expected: {
      transformedData: [
        {
          Year: '2015-2016',
          Market: 123,
          Intermediate: 456,
        },
      ],
      transformedTargets: [{ x: '2015-2016', y: 181 }],
    },
  },
  {
    title: 'returns null target data if higher than api data years',
    data: [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
    ],
    targets: {
      '2016-2017': '155',
    },
    expected: {
      transformedData: [
        {
          Year: '2015-2016',
          Market: 123,
          Intermediate: 456,
        },
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'returns null targets if no targets present',
    data: [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
    ],
    targets: undefined,
    expected: {
      transformedData: [
        {
          Year: '2015-2016',
          Market: 123,
          Intermediate: 456,
        },
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'returns undefined if no data present',
    data: undefined,
    targets: undefined,
    expected: undefined,
  },
];

describe('tenureHousingTransformer', () => {
  dataArray.forEach(({ title, data, targets, expected }) =>
    it(title, () => {
      const result = tenureHousingTransformer(data, targets);
      expect(result).toEqual(expected);
    }),
  );
});
