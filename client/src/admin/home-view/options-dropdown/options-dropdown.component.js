import React, { useEffect } from 'react';

import useComponentVisible from '../../../hooks/useComponentVisible';

import styles from './options-dropdown.module.css';

const OptionsDropdown = ({ textContent, onClick, close }) => {
  const { ref, isComponentVisible } = useComponentVisible(true);

  useEffect(() => {
    if (!isComponentVisible) {
      close();
    }
  }, [isComponentVisible, close]);

  const handleClick = () => {
    onClick();
  };
  return (
    <button
      data-testid="options-dropdown-button"
      ref={ref}
      className={styles.optionsButton}
      onClick={handleClick}
    >
      {textContent}
    </button>
  );
};

export default OptionsDropdown;
