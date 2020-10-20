import { userSelector } from './accounts.selectors';

describe('accounts selectors', () => {
  describe('userSelector', () => {
    it('returns undefined if state is undefined', () => {
      const result = userSelector(undefined);
      expect(result).toBeUndefined();
    });

    it('returns undefined if accounts is undefined', () => {
      const state = {};
      const result = userSelector(state);
      expect(result).toBeUndefined();
    });

    it('returns undefined if user is undefined', () => {
      const state = {
        accounts: {},
      };
      const result = userSelector(state);
      expect(result).toBeUndefined();
    });

    it('returns the user value', () => {
      const state = {
        accounts: {
          user: 'hello',
        },
      };
      const result = userSelector(state);
      expect(result).toEqual(state.accounts.user);
    });
  });
});
