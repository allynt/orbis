import React, { useEffect } from 'react';
import { ReactComponent as SearchIcon } from './magnifier.svg';
import formStyles from 'forms.module.css';
import { useState } from 'react';

const GEOCODE_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

/**
 * @param {{ mapboxApiAccessToken: string }} props
 */
export const Geocoder = ({ mapboxApiAccessToken }) => {
  if (!mapboxApiAccessToken)
    console.warn('You need to provide a Mapbox API token to <Geocoder />');

  /** @type {[string, React.Dispatch<string>]} */
  const [searchString, setSearchString] = useState('');
  /** @type {[import('@turf/turf').Feature[], React.Dispatch<import('@turf/turf').Feature[]>]} */
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const search = async () => {
      const response = await fetch(
        `${GEOCODE_API_URL}${searchString}.json?access_token=${mapboxApiAccessToken}`,
      );

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results.features);
      }
    };
    if (searchString?.length >= 3 && mapboxApiAccessToken) {
      search();
    }
  }, [mapboxApiAccessToken, searchString]);

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
      {searchResults.map(feature => (
        <p key={feature.id}>{feature.place_name}</p>
      ))}
    </div>
  );
};
