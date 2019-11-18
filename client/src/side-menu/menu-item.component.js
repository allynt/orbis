import React from 'react';
import PropTypes from 'prop-types';

import styles from './menu-item.module.css';

const MenuItem = ({ children }) => (
  <div className={styles['menu-item']}>
    {children}
    <hr />
  </div>
);

MenuItem.propTypes = {
  children: PropTypes.object.isRequired
};

export default MenuItem;
