import reducer, { setVisibility, visibilitySelector } from './crowdless.slice';

describe('crowdless slice', () => {
  describe('actions', () => {
    describe('setVisibility', () => {
      it('sets the visibility', () => {
        // @ts-ignore
        const result = reducer({ visible: true }, setVisibility(false));
        expect(result).toEqual(expect.objectContaining({ visible: false }));
      });
    });
  });

  describe('selectors', () => {
    describe('visibilitySelector', () => {
      it('returns visible', () => {
        const state = { crowdless: { visible: true } };
        const result = visibilitySelector(state);
        expect(result).toBe(state.crowdless.visible);
      });

      it('returns false is visible is undefined', () => {
        const state = { crowdless: {} };
        const result = visibilitySelector(state);
        expect(result).toBe(false);
      });

      it('returns false if state is undefined', () => {
        const state = {};
        const result = visibilitySelector(state);
        expect(result).toBe(false);
      });
    });
  });
});
