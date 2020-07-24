import React, { useEffect } from 'react';

import styles from './options-dropdown.module.css';

import useComponentVisible from 'hooks/useComponentVisible';

export const OptionsDropdown = ({ children, className, onClickAway }) => {
  const { ref, isComponentVisible } = useComponentVisible(true);

  useEffect(() => {
    if (!isComponentVisible) {
      onClickAway();
    }
  }, [isComponentVisible, onClickAway]);

  return (
    <div ref={ref} className={`${styles.optionsDropdown} ${className}`}>
      {children}
    </div>
  );
};

export default OptionsDropdown;
