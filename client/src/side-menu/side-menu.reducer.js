import { TOGGLE_MENU, TOGGLE_MENU_ITEM } from './side-menu.actions';

export const INITIAL_STATE = {
  isMenuVisible: false,
  visibleMenuItem: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return { ...state, isMenuVisible: !state.isMenuVisible };

    case TOGGLE_MENU_ITEM:
      return { ...state, visibleMenuItem: action.label };

    default:
      return state;
  }
};
