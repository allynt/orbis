import reducer, { themes, selectTheme } from './theming.slice';

describe('Theming Slice', () => {
  describe('Theming Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        themes,
        selectedTheme: themes[1]
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the selected Theme in state', () => {
      const theme = themes[1];

      const actualState = reducer(beforeState, {
        type: selectTheme.type,
        payload: theme.value
      });

      expect(actualState.selectedTheme).toEqual(theme);
    });
  });
});
