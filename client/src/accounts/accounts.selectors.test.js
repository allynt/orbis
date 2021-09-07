import {
  errorSelector,
  isLoadingSelector,
  isLoggedInSelector,
  passwordChangeStatusSelector,
  passwordResetStatusSelector,
  userKeySelector,
  userSelector,
} from './accounts.selectors';

describe('accounts selectors', () => {
  describe.each`
    selectorName                      | selector                        | stateKey          | value
    ${'errorSelector'}                | ${errorSelector}                | ${'error'}        | ${{ error: 'yup' }}
    ${'passwordResetStatusSelector'}  | ${passwordResetStatusSelector}  | ${'resetStatus'}  | ${'reset'}
    ${'passwordChangeStatusSelector'} | ${passwordChangeStatusSelector} | ${'changeStatus'} | ${'changed'}
    ${'userSelector'}                 | ${userSelector}                 | ${'user'}         | ${{ name: 'John Smith' }}
    ${'userKeySelector'}              | ${userKeySelector}              | ${'userKey'}      | ${'1234'}
  `('$selectorName', ({ selector, stateKey, value }) => {
    it('returns undefined if state is undefined', () => {
      const result = selector(undefined);
      expect(result).toBeUndefined();
    });

    it('returns undefined if accounts is undefined', () => {
      const state = {};
      const result = selector(state);
      expect(result).toBeUndefined();
    });

    it(`returns undefined if ${stateKey} is undefined`, () => {
      const state = {
        accounts: {
          [stateKey]: undefined,
        },
      };
      const result = selector(state);
      expect(result).toBeUndefined();
    });

    it('returns the value', () => {
      const state = {
        accounts: { [stateKey]: value },
      };
      expect(selector(state)).toEqual(value);
    });
  });

  describe('isLoggedInSelector', () => {
    it.each`
      userKey      | user                 | expected
      ${undefined} | ${undefined}         | ${false}
      ${'123'}     | ${undefined}         | ${false}
      ${undefined} | ${{ name: 'hello' }} | ${false}
      ${'123'}     | ${{ name: 'hello' }} | ${true}
    `(
      'returns $expected when userKey is $userKey and user is $user',
      ({ userKey, user, expected }) => {
        const result = isLoggedInSelector({ accounts: { userKey, user } });
        expect(result).toBe(expected);
      },
    );
  });
});
