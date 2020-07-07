import reducer, {
  toggleMenu,
  setMenuHeadings,
  closeMenu,
} from './side-menu.slice';

describe('Side Menu Slice', () => {
  describe('Side Menu Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        isMenuVisible: false,
        visibleMenuItem: '',
        heading: '',
        strapline: '',
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    describe('toggleMenu', () => {
      it('should toggle side menu open, if not already', () => {
        const actualState = reducer(beforeState, {
          type: toggleMenu.type,
          payload: 'Test Item',
        });

        expect(actualState.isMenuVisible).toEqual(true);
      });

      it('should toggle side menu closed, if already open already with selected item', () => {
        beforeState.visibleMenuItem = 'Test Item';
        beforeState.isMenuVisible = true;

        const actualState = reducer(beforeState, {
          type: toggleMenu.type,
          payload: 'Test Item',
        });

        expect(actualState.visibleMenuItem).toEqual('');
        expect(actualState.isMenuVisible).toEqual(false);
      });

      it('should not toggle side menu open, if `screenshot` option selected', () => {
        const actualState = reducer(beforeState, {
          type: toggleMenu.type,
          payload: 'screenshot',
        });

        expect(actualState.visibleMenuItem).toEqual('');
        expect(actualState.isMenuVisible).toEqual(false);
      });

      it('does not close the menu if already open and a different item is clicked', () => {
        beforeState.isMenuVisible = true;
        beforeState.visibleMenuItem = 'Item 1';

        const actualState = reducer(beforeState, toggleMenu('Item 2'));
        expect(actualState.isMenuVisible).toBe(true);
        expect(actualState.visibleMenuItem).toBe('Item 2');
      });
    });

    describe('setMenuHeadings', () => {
      it('should update heading and strapline state, when called', () => {
        const payload = {
          heading: 'Test Heading',
          strapline: 'Test Strapline',
        };

        const actualState = reducer(beforeState, {
          type: setMenuHeadings.type,
          payload,
        });

        expect(actualState.heading).toEqual(payload.heading);
        expect(actualState.strapline).toEqual(payload.strapline);
      });
    });

    describe('closeMenu', () => {
      it('should update state so Side Menu closes', () => {
        const actualState = reducer(beforeState, {
          type: closeMenu.type,
        });

        expect(actualState.visibleMenuItem).toEqual('');
        expect(actualState.isMenuVisible).toEqual(false);
      });
    });
  });
});
