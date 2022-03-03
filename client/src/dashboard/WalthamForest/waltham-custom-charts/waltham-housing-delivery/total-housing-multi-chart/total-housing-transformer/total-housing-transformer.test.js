import { totalHousingTransformer } from './total-housing-transformer';

const padArray = [
  { x: '2011-2012', y: null },
  { x: '2012-2013', y: null },
  { x: '2013-2014', y: null },
  { x: '2014-2015', y: null },
];

const dataArray = [
  {
    title: 'transforms API and target data into correct data shape',
    data: [
      {
        Year: '2015-2016',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2016-2017',
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: {
      '2015-2016': '181',
      '2016-2017': '155',
    },
    expected: {
      transformedData: [
        [...padArray, { x: '2015-2016', y: 123 }, { x: '2016-2017', y: 789 }],
        [...padArray, { x: '2015-2016', y: 456 }, { x: '2016-2017', y: 101 }],
      ],
      transformedTargets: [
        { x: '2015-2016', y: 181 },
        { x: '2016-2017', y: 155 },
      ],
    },
  },
  {
    title: 'pads gap years with `null` value',
    data: [
      {
        Year: '2015-2016',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2017-2018',
        'Total Gross': 456,
        'Total Net': 789,
      },
    ],
    targets: {
      '2015-2016': '254',
      '2016-2017': '191',
      '2017-2018': '181',
    },
    expected: {
      transformedData: [
        [
          ...padArray,
          { x: '2015-2016', y: 123 },
          { x: '2016-2017', y: null },
          { x: '2017-2018', y: 456 },
        ],
        [
          ...padArray,
          { x: '2015-2016', y: 456 },
          { x: '2016-2017', y: null },
          { x: '2017-2018', y: 789 },
        ],
      ],
      transformedTargets: [
        { x: '2015-2016', y: 254 },
        { x: '2016-2017', y: 191 },
        { x: '2017-2018', y: 181 },
      ],
    },
  },
  {
    title: 'returns data from lowest year to highest year of either dataset',
    data: [
      {
        Year: '2016-2017',
        'Total Gross': 123,
        'Total Net': 456,
      },
    ],
    targets: {
      '2015-2016': '191',
      '2017-2018': '254',
    },
    expected: {
      transformedData: [
        [
          ...padArray,
          { x: '2015-2016', y: null },
          { x: '2016-2017', y: 123 },
          { x: '2017-2018', y: null },
        ],
        [
          ...padArray,
          { x: '2015-2016', y: null },
          { x: '2016-2017', y: 456 },
          { x: '2017-2018', y: null },
        ],
      ],
      transformedTargets: [
        { x: '2015-2016', y: 191 },
        { x: '2017-2018', y: 254 },
      ],
    },
  },
  {
    title: 'works if target data is undefined',
    data: [
      {
        Year: '2015-2016',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2016-2017',
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: undefined,
    expected: {
      transformedData: [
        [...padArray, { x: '2015-2016', y: 123 }, { x: '2016-2017', y: 789 }],
        [...padArray, { x: '2015-2016', y: 456 }, { x: '2016-2017', y: 101 }],
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'works if target data is empty object',
    data: [
      {
        Year: '2015-2016',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2016-2017',
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: {},
    expected: {
      transformedData: [
        [...padArray, { x: '2015-2016', y: 123 }, { x: '2016-2017', y: 789 }],
        [...padArray, { x: '2015-2016', y: 456 }, { x: '2016-2017', y: 101 }],
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'returns undefined if data is not present',
    data: undefined,
    targets: undefined,
    expected: undefined,
  },
];

describe('totalHousingTransformer', () => {
  dataArray.forEach(({ title, data, targets, expected }) =>
    it(title, () => {
      const result = totalHousingTransformer(data, targets);
      expect(result).toEqual(expected);
    }),
  );
});
