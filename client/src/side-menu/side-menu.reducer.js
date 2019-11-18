import { TOGGLE_MENU } from './side-menu.actions';

export const INITIAL_STATE = {
  isMenuVisible: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return { ...state, isMenuVisible: !state.isMenuVisible };

    default:
      return state;
  }
};
