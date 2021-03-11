import { dateStringToDate, isValid } from './dates';

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

describe('dateStringToDate', () => {
  it('converts dd/MM/yyyy to a date object', () => {
    expect(dateStringToDate('01/01/2020')).toEqual(new Date(2020, 0, 1));
  });

  it('converts d/M/yy to a date object', () => {
    expect(dateStringToDate('1/1/20')).toEqual(new Date(1920, 0, 1));
  });
});
