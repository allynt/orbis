import React, { useEffect } from 'react';
import { ReactComponent as SearchIcon } from './magnifier.svg';
import formStyles from 'forms.module.css';
import { useState } from 'react';

export const Geocoder = () => {
  /** @type {[string, React.Dispatch<string>]} */
  const [searchString, setSearchString] = useState();

  useEffect(() => {
    if (searchString?.length >= 3) {
      console.log('Do a search');
    }
  }, [searchString]);

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const handleInputChange = e => {
    setSearchString(e.target.value);
  };

  return (
    <div>
      <SearchIcon title="Location Search" />
      <label className={formStyles.hiddenLabel} htmlFor="geocoder">
        Location Search
      </label>
      <input
        type="text"
        id="geocoder"
        value={searchString}
        onChange={handleInputChange}
      />
    </div>
  );
};
