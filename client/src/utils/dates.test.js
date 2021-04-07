import {
  dateStringToDate,
  formatDate,
  isIsoDate,
  isValid,
  isValidDateString,
  stringDateRangeToDateRange,
  toDMY,
} from './dates';

describe('Date utils', () => {
  describe('formatDate', () => {
    it('returns the date using the default format', () => {
      expect(formatDate(new Date(2077, 9, 23))).toBe('23/10/2077');
    });

    it('returns the date using the specified format', () => {
      expect(formatDate(new Date(2077, 9, 23), 'dd - MMM - yyyy')).toBe(
        '23 - Oct - 2077',
      );
    });
  });

  describe('isValid', () => {
    it('validates dates', () => {
      expect(isValid(1, 1, 2020)).toBe(true);
    });

    it('Works on 1 indexed months', () => {
      expect(isValid(1, 0, 2020)).toBe(false);
    });

    it('Works on February', () => {
      expect(isValid(30, 2, 2020)).toBe(false);
    });

    it('Works for leap years', () => {
      expect(isValid(29, 2, 2020)).toBe(true);
      expect(isValid(29, 2, 2019)).toBe(false);
    });

    it('Works for two digit years', () => {
      expect(isValid(29, 2, 20)).toBe(true);
    });
  });

  describe('toDMY', () => {
    it.each`
      separator
      ${'/'}
      ${'.'}
      ${'-'}
    `('Returns a date string split on $separator', ({ separator }) => {
      expect(toDMY(`23${separator}10${separator}2077`)).toEqual([23, 10, 2077]);
    });
  });

  describe('isIsoDate', () => {
    it.each`
      value                         | returns
      ${'2015-02-21T00:52:43.822Z'} | ${true}
      ${'2015-02-21T00:52:43.822'}  | ${false}
      ${'2015-02-21T00:52:43Z'}     | ${true}
      ${'2015-02-21T00:52:43'}      | ${false}
      ${'2015-02-21T00:52Z'}        | ${true}
      ${'2015-02-21T00:52'}         | ${false}
      ${'2015-02-21T00Z'}           | ${false}
      ${'2015-02-21'}               | ${false}
    `('returns $returns for $value', ({ value, returns }) => {
      expect(isIsoDate(value)).toBe(returns);
    });
  });

  describe('isValidDateString', () => {
    it.each`
      value                         | returns
      ${'2020-01-01'}               | ${true}
      ${'01-01-2020'}               | ${true}
      ${'2020.01.01'}               | ${true}
      ${'01.01.2020'}               | ${true}
      ${'2020/01/01'}               | ${true}
      ${'01/01/2020'}               | ${true}
      ${'01'}                       | ${true}
      ${'01/01'}                    | ${true}
      ${'01/0'}                     | ${false}
      ${'01/0'}                     | ${false}
      ${'2020'}                     | ${true}
      ${'01/2020'}                  | ${false}
      ${'2020/01'}                  | ${true}
      ${'2015-02-21T00:52:43.822Z'} | ${true}
      ${'2015-02-21T00:52:43.822'}  | ${true}
      ${'2015-02-21T00:52:43Z'}     | ${true}
      ${'2015-02-21T00:52:43'}      | ${true}
      ${'2015-02-21T00:52Z'}        | ${true}
      ${'2015-02-21T00:52'}         | ${true}
      ${'2015-02-21T00Z'}           | ${false}
      ${'2015-02-21'}               | ${true}
    `('returns $returns for $value', ({ value, returns }) => {
      expect(isValidDateString(value)).toBe(returns);
    });
  });

  describe('dateStringToDate', () => {
    it('converts dd/MM/yyyy to a date object', () => {
      expect(dateStringToDate('01/01/2020')).toEqual(new Date(2020, 0, 1));
    });

    it('converts d/M/yy to a date object', () => {
      expect(dateStringToDate('1/1/20')).toEqual(new Date(1920, 0, 1));
    });

    it('Converts Iso strings to date object', () => {
      expect(dateStringToDate('2077-10-23T00:00:00.000Z')).toEqual(
        new Date('2077-10-23T00:00:00.000Z'),
      );
    });
  });

  describe('stringDateRangeToDateRange', () => {
    it('returns undefined if range does not have either start date or end date', () => {
      expect(stringDateRangeToDateRange({})).toBeUndefined();
    });

    it('Converts the string start date to a date if provided', () => {
      expect(stringDateRangeToDateRange({ startDate: '23/10/2077' })).toEqual(
        expect.objectContaining({ startDate: new Date(2077, 9, 23) }),
      );
    });

    it('Converts the string end date to a date if provided', () => {
      expect(stringDateRangeToDateRange({ endDate: '23/10/2077' })).toEqual(
        expect.objectContaining({ endDate: new Date(2077, 9, 23) }),
      );
    });

    it('Sets start date to 30 days previously if not provided', () => {
      expect(stringDateRangeToDateRange({ endDate: '23/10/2077' })).toEqual(
        expect.objectContaining({ startDate: new Date(2077, 8, 23) }),
      );
    });

    it('Sets end date to 30 days after if not provided', () => {
      expect(stringDateRangeToDateRange({ startDate: '23/10/2077' })).toEqual(
        expect.objectContaining({ endDate: new Date(2077, 10, 22) }),
      );
    });

    it('Uses the provided difference value', () => {
      expect(
        stringDateRangeToDateRange({ startDate: '23/10/2077' }, 1),
      ).toEqual(expect.objectContaining({ endDate: new Date(2077, 9, 24) }));
    });
  });
});
