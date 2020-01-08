import { TOGGLE_MENU, CLOSE_MENU, TOGGLE_MENU_ITEM, SET_MENU_HEADINGS } from './side-menu.actions';

export const INITIAL_STATE = {
  isMenuVisible: false,
  visibleMenuItem: '',
  heading: '',
  strapline: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      if (!state.isMenuVisible) {
        console.log('OPENING MENU');
        return { ...state, isMenuVisible: true };
      } else if (state.isMenuVisible && state.visibleMenuItem === action.label) {
        console.log('CLISING MENU');
        return { ...state, visibleMenuItem: '', isMenuVisible: false };
      }

      return state;

    case CLOSE_MENU:
      return { ...state, visibleMenuItem: '', isMenuVisible: false };

    case TOGGLE_MENU_ITEM:
      return { ...state, visibleMenuItem: action.label };

    case SET_MENU_HEADINGS:
      return { ...state, heading: action.heading, strapline: action.strapline };

    default:
      return state;
  }
};
