import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as SearchIcon } from './magnifier.svg';
import styles from './geocoder.module.css';

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
  /** @type {[import('@turf/turf').Feature, React.Dispatch<import('@turf/turf').Feature>]} */
  const [chosenResult, setChosenResult] = useState();
  const [showResults, setShowResults] = useState(false);
  const geocoderRef = useRef();

  const handleClickaway = event => {
    const path = event.path || (event.composedPath && event.composedPath());
    if (geocoderRef.current && !path.includes(geocoderRef.current))
      setShowResults(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickaway, true);
    return () => {
      document.removeEventListener('click', handleClickaway, true);
    };
  }, []);

  useEffect(() => {
    const search = async () => {
      const response = await fetch(
        `${GEOCODE_API_URL}${searchString}.json?access_token=${mapboxApiAccessToken}`,
      );

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results.features);
        setShowResults(true);
      }
    };
    if (searchString.length >= 3 && searchString !== chosenResult?.place_name) {
      search();
    }
  }, [mapboxApiAccessToken, searchString, chosenResult]);

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const handleInputChange = e => {
    setSearchString(e.target.value);
  };

  const handleResultClick = feature => () => {
    if (onSelect) onSelect(feature);
    setChosenResult(feature);
    setSearchString(feature.place_name);
    setShowResults(false);
  };

  return (
    <div ref={geocoderRef} className={`${styles.geocoder} ${className}`}>
      <div className={styles.searchBox}>
        <SearchIcon className={styles.icon} title="Location Search" />
        <label className={styles.label} htmlFor="geocoder">
          Location Search
        </label>
        <input
          autoComplete="off"
          className={styles.input}
          type="text"
          id="geocoder"
          value={searchString}
          placeholder="type to search..."
          onChange={handleInputChange}
          onFocus={() => {
            if (searchResults.length) setShowResults(true);
          }}
        />
      </div>
      {showResults && (
        <ul className={styles.resultsList}>
          {searchResults.map(feature => (
            <li
              key={feature.id}
              className={styles.resultsListItem}
              onClick={handleResultClick(feature)}
            >
              {feature.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
