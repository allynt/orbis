import {
  groupedDataTransformer,
  lineDataTransformer,
  stringToNumberTransformer,
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

  describe('stringToNumberTransformer', () => {
    it('converts string values to numbers', () => {
      const input = [
        {
          x: 'key-1',
          y: '123',
        },
      ];

      const result = stringToNumberTransformer(input);
      expect(result).toEqual([
        {
          x: 'key-1',
          y: 123,
        },
      ]);
    });

    it('does not affect values that are already numbers', () => {
      const input = [
          {
            x: 'key-1',
            y: '123',
          },
          {
            x: 'key-2',
            y: 456,
          },
        ],
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

      const result = stringToNumberTransformer(input);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = stringToNumberTransformer(undefined);
      expect(result).toBeUndefined();
    });
  });
});
