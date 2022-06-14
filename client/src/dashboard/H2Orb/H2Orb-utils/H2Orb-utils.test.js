import { getPercentage } from './H2Orb-utils';

describe('getPercentage', () => {
  it('at minimum, should be 0', () => {
    expect(getPercentage(20, 100, 20)).toBe(0.0);
  });
  it('at maximum, should be 100', () => {
    expect(getPercentage(20, 120, 120)).toBe(100.0);
  });
  it('mid range, should be 50', () => {
    expect(getPercentage(1, 3, 2)).toBe(50.0);
  });
  it('below min, should be negative', () => {
    expect(getPercentage(0, 100, -2)).toBe(-2.0);
  });
  it('above max, should be >100', () => {
    expect(getPercentage(0, 100, 150)).toBeGreaterThan(100.0);
  });
});
