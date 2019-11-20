export const TOGGLE_MENU = 'TOGGLE_MENU';
export const TOGGLE_MENU_ITEM = 'TOGGLE_MENU_ITEM';

export const toggleMenu = () => dispatch => dispatch({ type: TOGGLE_MENU });

export const toggleMenuItem = label => dispatch => dispatch({ type: TOGGLE_MENU_ITEM, label });
