import React from 'react';

import { useSelector } from 'react-redux';

import style from './side-menu.module.css';

const SideMenu = ({ children }) => {
  const isMenuVisible = useSelector(state => state.sidebar.isMenuVisible);

  return (
    <div
      className={`${style['side-menu-container']} ${
        isMenuVisible ? style.show : ''
      }`}
    >
      {children}
    </div>
  );
};

export default SideMenu;
