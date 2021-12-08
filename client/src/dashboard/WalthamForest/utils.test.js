import {
  groupedDataTransformer,
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
} from './utils';

describe('Waltham Forest Data Transformers', () => {
  describe('groupedDataTransformer', () => {
    it('sorts gross and net values into two nested arrays', () => {
      const data = [
          {
            Year: '2020',
            'Total Gross': 123,
            'Total Net': 456,
          },
          {
            Year: '2020',
            'Total Gross': 789,
            'Total Net': 101,
          },
        ],
        expected = [
          [
            { x: '2020', y: 123 },
            { x: '2020', y: 789 },
          ],
          [
            { x: '2020', y: 456 },
            { x: '2020', y: 101 },
          ],
        ];

      const result = groupedDataTransformer(data);
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

  describe.only('getTargetTotals', () => {
    it('totals up all of the values by year', () => {
      const data = {
          dataset1: {
            '2015-2016': '100',
            '2016-2017': '200',
            '2018-2019': '300',
          },
          dataset2: {
            '2015-2016': '400',
            '2016-2017': '500',
            '2018-2019': '600',
          },
          dataset3: {
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
          dataset1: {
            '2015-2016': '100',
            '2016-2017': '50',
          },
          dataset2: {
            '2015-2016': '400',
            '2016-2017': '0',
            '2017-2018': '600',
            '2018-2019': '200',
          },
          dataset3: {
            '2014-2015': '200',
            '2016-2017': '800',
            '2018-2019': '900',
            '2019-2020': '700',
          },
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

    it('returns undefined if data is not present', () => {
      const result = getTargetTotals(undefined);
      expect(result).toBeUndefined();
    });
  });
});
