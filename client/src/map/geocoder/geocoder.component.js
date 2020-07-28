import React, { useEffect } from 'react';
import { ReactComponent as SearchIcon } from './magnifier.svg';
import formStyles from 'forms.module.css';
import { useState } from 'react';

const GEOCODE_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

/**
 * @param {{
 *   className: string
 *   mapboxApiAccessToken: string
 *   onSelect: (feature: import('@turf/turf').Feature) => void
 *  }} props
 */
export const Geocoder = ({ className, mapboxApiAccessToken, onSelect }) => {
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
    if (searchString.length >= 3) {
      search();
    }
  }, [mapboxApiAccessToken, searchString]);

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const handleInputChange = e => {
    setSearchString(e.target.value);
  };

  const handleResultClick = feature => () => {
    if (onSelect) onSelect(feature);
  };

  return (
    <div className={className}>
      <SearchIcon title="Location Search" />
      <label className={formStyles.hiddenLabel} htmlFor="geocoder">
        Location Search
      </label>
      <input
        type="text"
        id="geocoder"
        value={searchString}
        placeholder="type to search..."
        onChange={handleInputChange}
      />
      {searchResults.map(feature => (
        <p key={feature.id} onClick={handleResultClick(feature)}>
          {feature.place_name}
        </p>
      ))}
    </div>
  );
};
