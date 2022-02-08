import {
  groupedDataTransformer,
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
  getUser5YearTotals,
} from './utils';

describe('Waltham Forest Data Transformers', () => {
  describe.only('groupedDataTransformer', () => {
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
        2010: '254',
        2018: '191',
        2019: '181',
        2020: '155',
      };

      const expected = [
        [
          { x: 2010, y: null },
          { x: 2011, y: 123 },
          { x: 2012, y: null },
          { x: 2013, y: null },
          { x: 2014, y: null },
          { x: 2015, y: null },
          { x: 2016, y: null },
          { x: 2017, y: null },
          { x: 2018, y: null },
          { x: 2019, y: 789 },
          { x: 2020, y: null },
        ],
        [
          { x: 2010, y: null },
          { x: 2011, y: 456 },
          { x: 2012, y: null },
          { x: 2013, y: null },
          { x: 2014, y: null },
          { x: 2015, y: null },
          { x: 2016, y: null },
          { x: 2017, y: null },
          { x: 2018, y: null },
          { x: 2019, y: 101 },
          { x: 2020, y: null },
        ],
      ];
      const result = groupedDataTransformer(data, targets);
      expect(result).toEqual(expected);
    });
  });

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

      const result = userTargetTransformer(input);
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

      const result = userTargetTransformer(input);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = userTargetTransformer(undefined);
      expect(result).toBeUndefined();
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
});
