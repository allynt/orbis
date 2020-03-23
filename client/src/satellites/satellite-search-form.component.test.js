import { savedSearchToFormValues } from './satellite-search-form.component';

describe('savedSearchToFormValues', () => {
  it('must spread the satellites array correctly', () => {
    const savedSearch = { satellites: ['sentinel-1', 'sentinel-2', 'sentinel-3'] };
    const expected = { 'sentinel-1': true, 'sentinel-2': true, 'sentinel-3': true };
    const result = savedSearchToFormValues(savedSearch);
    expect(result).toEqual(expected);
  });

  describe('must not spread satellites if none exist', () => {
    it('empty array', () => {
      const savedSearch = { satellites: [] };
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });

    it('undefined', () => {
      const savedSearch = {};
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });
  });

  it('must spread the tiers array correctly', () => {
    const savedSearch = { tiers: ['free', 'high'] };
    const expected = { free: true, high: true };
    const result = savedSearchToFormValues(savedSearch);
    expect(result).toEqual(expected);
  });

  describe('must not spread tiers if none exist', () => {
    it('empty array', () => {
      const savedSearch = { tiers: [] };
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });

    it('undefined', () => {
      const savedSearch = {};
      const expected = {};
      const result = savedSearchToFormValues(savedSearch);
      expect(result).toEqual(expected);
    });
  });

  it('must spread each array when both are present', () => {
    const savedSearch = { satellites: ['sentinel-1', 'sentinel-2', 'sentinel-3'], tiers: ['free', 'high'] };
    const expected = { 'sentinel-1': true, 'sentinel-2': true, 'sentinel-3': true, free: true, high: true };
    const result = savedSearchToFormValues(savedSearch);
    expect(result).toEqual(expected);
  });
});
