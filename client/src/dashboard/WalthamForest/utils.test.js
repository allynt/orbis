import {
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
  getPastYears,
  getUser5YearTotals,
  getDataTimeline,
} from './utils';

describe('Waltham Forest Data Transformers', () => {
  describe('lineDataTransformer', () => {
    it('gives all entries uniform keys, and sets missing data to null', () => {
      const data = [
          { 'test-key-1': 123 },
          { 'test-key-1': 456, 'test-key-2': 789 },
        ],
        expected = [
          { 'test-key-1': 123, 'test-key-2': null },
          { 'test-key-1': 456, 'test-key-2': 789 },
        ];

      const result = lineDataTransformer(data);
      expect(result).toEqual(expected);
    });

    it('returns original data if no non-shared keys', () => {
      const data = [
        { 'test-key-1': 123, 'test-key-2': 456 },
        { 'test-key-1': 789, 'test-key-2': 101 },
      ];

      const result = lineDataTransformer(data);
      expect(result).toEqual(data);
    });

    it('only affects undefined keys', () => {
      const data = [
        { 'test-key-1': '', 'test-key-2': 0 },
        { 'test-key-1': false, 'test-key-2': null },
      ];

      const result = lineDataTransformer(data);
      expect(result).toEqual(data);
    });
  });

  describe('filterEmptyStrings', () => {
    it('filters out empty string values from object', () => {
      const data = {
          'key-1': 123,
          'key-2': '',
          'key-3': 456,
        },
        expected = {
          'key-1': 123,
          'key-3': 456,
        };

      const result = filterEmptyStrings(data);
      expect(result).toEqual(expected);
    });

    it('does not filter 0 values', () => {
      const data = {
        'key-1': 123,
        'key-2': 0,
        'key-3': 456,
      };

      const result = filterEmptyStrings(data);
      expect(result).toEqual(data);
    });

    it('returns undefined if data is not present', () => {
      const result = filterEmptyStrings(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('getTargetTotals', () => {
    it('totals up all of the values by year', () => {
      const data = {
          tenureType1: {
            '2015-2016': '100',
            '2016-2017': '200',
            '2018-2019': '300',
          },
          tenureType2: {
            '2015-2016': '400',
            '2016-2017': '500',
            '2018-2019': '600',
          },
          tenureType3: {
            '2015-2016': '700',
            '2016-2017': '800',
            '2018-2019': '900',
          },
        },
        expected = {
          '2015-2016': 1200,
          '2016-2017': 1500,
          '2018-2019': 1800,
        };

      const result = getTargetTotals(data);
      expect(result).toEqual(expected);
    });

    it('works with uneven data', () => {
      const data = {
          tenureType1: {
            '2015-2016': '100',
            '2016-2017': '50',
          },
          tenureType2: {
            '2015-2016': '400',
            '2016-2017': '0',
            '2017-2018': '600',
            '2018-2019': '200',
          },
          tenureType3: {
            '2014-2015': '200',
            '2016-2017': '800',
            '2018-2019': '900',
            '2019-2020': '700',
          },
          tenureType4: {},
        },
        expected = {
          '2014-2015': 200,
          '2015-2016': 500,
          '2016-2017': 850,
          '2017-2018': 600,
          '2018-2019': 1100,
          '2019-2020': 700,
        };

      const result = getTargetTotals(data);
      expect(result).toEqual(expected);
    });

    it('excludes totalHousing values', () => {
      const data = {
          tenureType1: {
            '2015-2016': '100',
            '2016-2017': '200',
          },
          tenureType2: {
            '2015-2016': '400',
            '2016-2017': '200',
          },
          totalHousing: {
            '2015-2016': '2000',
            '2016-2017': '3000',
          },
        },
        expected = {
          '2015-2016': 500,
          '2016-2017': 400,
        };

      const result = getTargetTotals(data);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = getTargetTotals(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('userTargetTransformer', () => {
    it('transforms data and converts string values to numbers', () => {
      const input = {
          'key-1': '123',
          'key-2': '456',
        },
        expected = [
          {
            x: 'key-1',
            y: 123,
          },
          {
            x: 'key-2',
            y: 456,
          },
        ];

      const result = userTargetTransformer(input, ['key-1', 'key-2']);
      expect(result).toEqual(expected);
    });

    it('does not affect values that are already numbers', () => {
      const input = {
          'key-1': '123',
          'key-2': 456,
        },
        expected = [
          {
            x: 'key-1',
            y: 123,
          },
          {
            x: 'key-2',
            y: 456,
          },
        ];

      const result = userTargetTransformer(input, ['key-1', 'key-2']);
      expect(result).toEqual(expected);
    });

    it('excludes values not present in timeline', () => {
      const input = {
          'key-1': '123',
          'key-2': '456',
        },
        expected = [
          {
            x: 'key-1',
            y: 123,
          },
        ];

      const result = userTargetTransformer(input, ['key-1']);
      expect(result).toEqual(expected);
    });

    it('returns all data if no timeline is provided', () => {
      const input = {
          'key-1': '123',
          'key-2': '456',
        },
        expected = [
          {
            x: 'key-1',
            y: 123,
          },
          {
            x: 'key-2',
            y: 456,
          },
        ];

      const result = userTargetTransformer(input, undefined);
      expect(result).toEqual(expected);
    });

    it('returns null if all targets fall outwith timeline', () => {
      const input = {
        'key-3': '123',
        'key-4': '456',
      };

      const result = userTargetTransformer(input, ['key-1', 'key-2']);
      expect(result).toBeNull();
    });

    it('returns undefined if data is not present', () => {
      const result = userTargetTransformer(undefined, []);
      expect(result).toBeUndefined();
    });
  });

  describe('getPastYears', () => {
    it('returns specified no. of previous years, formatted correctly', () => {
      const expected = ['2020-2021', '2021-2022', '2022-2023'];

      const result = getPastYears(3);
      expect(result).toEqual(expected);
    });

    it('defaults to 5 years if no args passed', () => {
      const expected = [
        '2018-2019',
        '2019-2020',
        '2020-2021',
        '2021-2022',
        '2022-2023',
      ];

      const result = getPastYears();
      expect(result).toEqual(expected);
    });
  });

  describe('getUser5YearTotals', () => {
    it('totals up data for last 5 years', () => {
      const data = {
          '2016-2017': '10',
          '2017-2018': '20',
          '2018-2019': '30',
          '2019-2020': '40',
          '2020-2021': '50',
        },
        expected = 150;

      const result = getUser5YearTotals(data);
      expect(result).toEqual(expected);
    });

    it('filters values outside of last 5 years', () => {
      const data = {
          '2014-2015': '1000',
          '2015-2016': '2000',
          '2016-2017': '10',
          '2017-2018': '20',
          '2018-2019': '30',
          '2019-2020': '40',
          '2020-2021': '50',
        },
        expected = 150;

      const result = getUser5YearTotals(data);
      expect(result).toEqual(expected);
    });

    it('works if not all 5 years have values', () => {
      const data = {
          '2016-2017': '10',
          '2017-2018': '20',
          '2018-2019': '30',
        },
        expected = 60;

      const result = getUser5YearTotals(data);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = getUser5YearTotals(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('getDataTimeline', () => {
    it('returns a timeline built from data years', () => {
      const data = [{ Year: '2010-2011' }, { Year: '2012-2013' }],
        expected = ['2010-2011', '2011-2012', '2012-2013'];

      const result = getDataTimeline(data);
      expect(result).toEqual(expected);
    });

    it('combines both datasets', () => {
      const data = [{ Year: '2010-2011' }, { Year: '2011-2012' }],
        targets = {
          '2009-2010': '123',
        },
        expected = ['2009-2010', '2010-2011', '2011-2012'];

      const result = getDataTimeline(data, targets);
      expect(result).toEqual(expected);
    });

    it('excludes target years higher than highest api year', () => {
      const data = [{ Year: '2010-2011' }, { Year: '2011-2012' }],
        targets = {
          '2014-2015': '123',
          '2015-2016': '456',
        },
        expected = ['2010-2011', '2011-2012'];

      const result = getDataTimeline(data, targets);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = getDataTimeline(undefined);
      expect(result).toBeUndefined();
    });
  });
});
