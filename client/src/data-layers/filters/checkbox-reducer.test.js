import { checkboxReducer } from './checkbox-reducer';

describe('checkboxReducer', () => {
  it('returns state by default', () => {
    const state = 'test';
    const result = checkboxReducer(state, { type: 'wrong type' });
    expect(result).toBe(state);
  });

  describe('handles adding an item to "toAdd"', () => {
    it('new layer', () => {
      const state = {};
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toAdd: { cars: { engine: ['V8'] } } };
      const result = checkboxReducer(state, { type: 'add/toAdd', item });
      expect(result).toEqual(expected);
    });

    it('existing layer', () => {
      const state = {
        toAdd: {
          cars: {
            engine: ['V6'],
          },
        },
      };
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toAdd: { cars: { engine: ['V6', 'V8'] } } };
      const result = checkboxReducer(state, { type: 'add/toAdd', item });
      expect(result).toEqual(expected);
    });
  });

  describe('handles removing an item from "toAdd"', () => {
    it('only value', () => {
      const state = { toAdd: { cars: { engine: ['V8'] } } };
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toAdd: { cars: { engine: [] } } };
      const result = checkboxReducer(state, { type: 'remove/toAdd', item });
      expect(result).toEqual(expected);
    });

    it('existing values', () => {
      const state = { toAdd: { cars: { engine: ['V12', 'V8'] } } };
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toAdd: { cars: { engine: ['V12'] } } };
      const result = checkboxReducer(state, { type: 'remove/toAdd', item });
      expect(result).toEqual(expected);
    });
  });

  describe('handles adding an item to "toRemove"', () => {
    it('new layer', () => {
      const state = {};
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toRemove: { cars: { engine: ['V8'] } } };
      const result = checkboxReducer(state, { type: 'add/toRemove', item });
      expect(result).toEqual(expected);
    });

    it('existing layer', () => {
      const state = {
        toRemove: {
          cars: {
            engine: ['V6'],
          },
        },
      };
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toRemove: { cars: { engine: ['V6', 'V8'] } } };
      const result = checkboxReducer(state, { type: 'add/toRemove', item });
      expect(result).toEqual(expected);
    });
  });

  describe('handles removing an item from "toRemove"', () => {
    it('only value', () => {
      const state = { toRemove: { cars: { engine: ['V8'] } } };
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toRemove: { cars: { engine: [] } } };
      const result = checkboxReducer(state, { type: 'remove/toRemove', item });
      expect(result).toEqual(expected);
    });

    it('existing values', () => {
      const state = { toRemove: { cars: { engine: ['V12', 'V8'] } } };
      const item = { layer: 'cars', property: 'engine', value: 'V8' };
      const expected = { toRemove: { cars: { engine: ['V12'] } } };
      const result = checkboxReducer(state, { type: 'remove/toRemove', item });
      expect(result).toEqual(expected);
    });
  });
});
