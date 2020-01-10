import React from 'react';
import PropTypes from 'prop-types';

import style from './side-menu.module.css';

const SideMenu = ({ isMenuVisible, children }) => (
  <div className={`${style['side-menu-container']} ${isMenuVisible ? style.show : ''}`}>{children}</div>
);

SideMenu.propTypes = {
  isMenuVisible: PropTypes.bool.isRequired
  // children: PropTypes.object.isRequired
};

export default SideMenu;
