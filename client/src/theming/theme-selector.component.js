import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';

import styles from './theme-selector.module.css';

const ThemeSelector = React.memo(({ themes, selectedTheme, selectTheme }) => (
  <>
    <label htmlFor="themeSelector" className={styles.label}>
      <strong>Theme:</strong>
    </label>
    <Select
      name="themeSelector"
      inputId="themeSelector"
      defaultValue={selectedTheme}
      className={styles.select}
      onChange={event => selectTheme(event.value)}
      options={themes}
    />
  </>
));

ThemeSelector.propTypes = {
  themes: PropTypes.array.isRequired,
  selectedTheme: PropTypes.object.isRequired,
  selectTheme: PropTypes.func.isRequired
};

export default ThemeSelector;
