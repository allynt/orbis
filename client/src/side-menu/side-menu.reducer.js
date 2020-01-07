import { TOGGLE_MENU, TOGGLE_MENU_ITEM } from './side-menu.actions';

export const INITIAL_STATE = {
  isMenuVisible: false,
  visibleMenuItem: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      if (!state.isMenuVisible) {
        return { ...state, isMenuVisible: true };
      } else if (state.isMenuVisible && state.visibleMenuItem === action.label) {
        return { ...state, isMenuVisible: false };
      }

    case TOGGLE_MENU_ITEM:
      return { ...state, visibleMenuItem: action.label };

    default:
      return state;
  }
};
