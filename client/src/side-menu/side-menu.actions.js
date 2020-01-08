export const TOGGLE_MENU = 'TOGGLE_MENU';
export const CLOSE_MENU = 'CLOSE_MENU';
export const TOGGLE_MENU_ITEM = 'TOGGLE_MENU_ITEM';
export const SET_MENU_HEADINGS = 'SET_MENU_HEADINGS';

export const toggleMenu = label => dispatch => dispatch({ type: TOGGLE_MENU, label });

export const closeMenu = () => dispatch => dispatch({ type: CLOSE_MENU });

export const toggleMenuItem = label => dispatch => dispatch({ type: TOGGLE_MENU_ITEM, label });

export const setMenuHeadings = (heading, strapline) => dispatch =>
  dispatch({ type: SET_MENU_HEADINGS, heading, strapline });
