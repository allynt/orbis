import { tenureHousingTransformer } from './tenure-housing-transformer';

jest.mock('dashboard/WalthamForest/waltham.constants', () => ({
  housingTenureTypes: {
    market: 'Market',
    intermediate: 'Intermediate',
  },
}));

describe('tenureHousingTransformer', () => {
  it('transforms API and target data into correct data shape', () => {
    const data = [
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
    ];

    const targets = {
      '2015-2016': '181',
      '2016-2017': '155',
    };

    const expected = {
      transformedData: data,
      transformedTargets: [
        { x: '2015-2016', y: 181 },
        { x: '2016-2017', y: 155 },
      ],
    };

    const result = tenureHousingTransformer(data, targets);
    expect(result).toEqual(expected);
  });

  it('pads null values if there are missing years', () => {
    const data = [
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
    ];

    const targets = {
      '2014-2015': '181',
      '2015-2016': '155',
    };

    const expected = {
      transformedData: [
        { Year: '2014-2015', Market: null, Intermediate: null },
        ...data,
      ],
      transformedTargets: [
        { x: '2014-2015', y: 181 },
        { x: '2015-2016', y: 155 },
      ],
    };

    const result = tenureHousingTransformer(data, targets);
    expect(result).toEqual(expected);
  });

  it('only returns data as high as latest year in api data', () => {
    const data = [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
    ];

    const targets = {
      '2015-2016': '181',
      '2016-2017': '155',
    };

    const expected = {
      transformedData: data,
      transformedTargets: [{ x: '2015-2016', y: 181 }],
    };

    const result = tenureHousingTransformer(data, targets);
    expect(result).toEqual(expected);
  });

  it('returns null target data if higher than api data years', () => {
    const data = [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
    ];

    const targets = {
      '2016-2017': '155',
    };

    const expected = {
      transformedData: data,
      transformedTargets: null,
    };

    const result = tenureHousingTransformer(data, targets);
    expect(result).toEqual(expected);
  });

  it('returns null targets if no targets present', () => {
    const data = [
      {
        Year: '2015-2016',
        Market: 123,
        Intermediate: 456,
      },
    ];

    const expected = {
      transformedData: data,
      transformedTargets: null,
    };

    const result = tenureHousingTransformer(data, undefined);
    expect(result).toEqual(expected);
  });

  it('returns undefined if no data present', () => {
    const result = tenureHousingTransformer(undefined);
    expect(result).toBeUndefined();
  });
});
