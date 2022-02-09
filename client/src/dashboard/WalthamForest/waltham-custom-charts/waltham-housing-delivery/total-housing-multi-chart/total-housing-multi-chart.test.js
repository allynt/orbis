import { dataTransformer } from './total-housing-multi-chart.component';

describe('dataTransformer', () => {
  it('sorts gross and net values into two nested arrays', () => {
    const data = [
      {
        Year: '2011-2012',
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        Year: '2019-2020',
        'Total Gross': 789,
        'Total Net': 101,
      },
    ];

    const targets = {
      '2010-2011': '254',
      '2018-2019': '191',
      '2019-2020': '181',
      '2020-2021': '155',
    };

    const expected = [
      [
        { x: '2010-2011', y: null },
        { x: '2011-2012', y: 123 },
        { x: '2012-2013', y: null },
        { x: '2013-2014', y: null },
        { x: '2014-2015', y: null },
        { x: '2015-2016', y: null },
        { x: '2016-2017', y: null },
        { x: '2017-2018', y: null },
        { x: '2018-2019', y: null },
        { x: '2019-2020', y: 789 },
        { x: '2020-2021', y: null },
      ],
      [
        { x: '2010-2011', y: null },
        { x: '2011-2012', y: 456 },
        { x: '2012-2013', y: null },
        { x: '2013-2014', y: null },
        { x: '2014-2015', y: null },
        { x: '2015-2016', y: null },
        { x: '2016-2017', y: null },
        { x: '2017-2018', y: null },
        { x: '2018-2019', y: null },
        { x: '2019-2020', y: 101 },
        { x: '2020-2021', y: null },
      ],
    ];
    const result = dataTransformer(data, targets);
    expect(result).toEqual(expected);
  });

  it('works with no target data', () => {
    const data = [
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
    ];

    const expected = [
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
    ];

    const result = dataTransformer(data, undefined);
    expect(result).toEqual(expected);
  });

  it('returns undefined if data is not present', () => {
    const result = dataTransformer(undefined, undefined);
    expect(result).toBeUndefined();
  });
});
