export const TOGGLE_MENU = 'TOGGLE_MENU';
export const TOGGLE_MENU_ITEM = 'TOGGLE_MENU_ITEM';

export const toggleMenu = label => dispatch => dispatch({ type: TOGGLE_MENU, label });

export const toggleMenuItem = label => dispatch => dispatch({ type: TOGGLE_MENU_ITEM, label });
