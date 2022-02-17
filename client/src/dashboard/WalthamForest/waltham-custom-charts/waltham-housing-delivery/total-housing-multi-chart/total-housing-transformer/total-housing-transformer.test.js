import { totalHousingTransformer } from './total-housing-transformer';

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
        [
          { x: '2015-2016', y: 123 },
          { x: '2016-2017', y: 789 },
        ],
        [
          { x: '2015-2016', y: 456 },
          { x: '2016-2017', y: 101 },
        ],
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
        Year: '2010-2011',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2012-2013',
        'Total Gross': 456,
        'Total Net': 789,
      },
    ],
    targets: {
      '2010-2011': '254',
      '2011-2012': '191',
      '2012-2013': '181',
    },
    expected: {
      transformedData: [
        [
          { x: '2010-2011', y: 123 },
          { x: '2011-2012', y: null },
          { x: '2012-2013', y: 456 },
        ],
        [
          { x: '2010-2011', y: 456 },
          { x: '2011-2012', y: null },
          { x: '2012-2013', y: 789 },
        ],
      ],
      transformedTargets: [
        { x: '2010-2011', y: 254 },
        { x: '2011-2012', y: 191 },
        { x: '2012-2013', y: 181 },
      ],
    },
  },
  {
    title:
      'returns data from lowest year of either dataset to highest year of API data only',
    data: [
      {
        Year: '2010-2011',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2012-2013',
        'Total Gross': 456,
        'Total Net': 789,
      },
    ],
    targets: {
      '2009-2010': '191',
      '2010-2011': '254',
      '2011-2012': '265',
      '2012-2013': '451',
      '2013-2014': '136',
      '2014-2015': '237',
    },
    expected: {
      transformedData: [
        [
          { x: '2009-2010', y: null },
          { x: '2010-2011', y: 123 },
          { x: '2011-2012', y: null },
          { x: '2012-2013', y: 456 },
        ],
        [
          { x: '2009-2010', y: null },
          { x: '2010-2011', y: 456 },
          { x: '2011-2012', y: null },
          { x: '2012-2013', y: 789 },
        ],
      ],
      transformedTargets: [
        { x: '2009-2010', y: 191 },
        { x: '2010-2011', y: 254 },
        { x: '2011-2012', y: 265 },
        { x: '2012-2013', y: 451 },
      ],
    },
  },
  {
    title: 'works if target data is undefined',
    data: [
      {
        Year: '2017-2018',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2019-2020',
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: undefined,
    expected: {
      transformedData: [
        [
          { x: '2017-2018', y: 123 },
          { x: '2018-2019', y: null },
          { x: '2019-2020', y: 789 },
        ],
        [
          { x: '2017-2018', y: 456 },
          { x: '2018-2019', y: null },
          { x: '2019-2020', y: 101 },
        ],
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'works if target data is empty object',
    data: [
      {
        Year: '2017-2018',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2019-2020',
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: {},
    expected: {
      transformedData: [
        [
          { x: '2017-2018', y: 123 },
          { x: '2018-2019', y: null },
          { x: '2019-2020', y: 789 },
        ],
        [
          { x: '2017-2018', y: 456 },
          { x: '2018-2019', y: null },
          { x: '2019-2020', y: 101 },
        ],
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
  {
    title: 'returns null target values if all are higher than api years',
    data: [
      {
        Year: '2017-2018',
        'Total Gross': 123,
        'Total Net': 456,
      },
    ],
    targets: {
      '2018-2019': '237',
    },
    expected: {
      transformedData: [
        [{ x: '2017-2018', y: 123 }],
        [{ x: '2017-2018', y: 456 }],
      ],
      transformedTargets: null,
    },
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
