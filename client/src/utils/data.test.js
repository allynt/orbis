import { getValueForTimestamp } from './data';

describe('Data utils', () => {
  const timeseries = [
    { timestamp: new Date(2019).toISOString(), value: 123 },
    { timestamp: new Date(2020).toISOString(), value: 456 },
    { timestamp: new Date(2021).toISOString(), value: 789 },
  ];

  it('Returns the value in the timeseries for the given timestamp if a number', () => {
    const timestamp = new Date(2020).getTime();
    const result = getValueForTimestamp(timeseries, timestamp);
    expect(result).toEqual(456);
  });

  it('Returns the value in the timeseries for the given timestamp if a string', () => {
    const timestamp = new Date(2020).toISOString();
    const result = getValueForTimestamp(timeseries, timestamp);
    expect(result).toEqual(456);
  });

  it("Returns undefined if a value can't be found", () => {
    const timestamp = new Date(1999).getTime();
    const result = getValueForTimestamp(timeseries, timestamp);
    expect(result).toBeUndefined();
  });
});
