import React, { useEffect, useRef, useReducer } from 'react';
import { ReactComponent as SearchIcon } from './magnifier.svg';
import styles from './geocoder.module.css';

const GEOCODE_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

/**
 * @typedef {import('@turf/turf').Feature & {place_name?: string}} Feature
 */

/**
 * @typedef State
 * @property {string} searchString
 * @property {Feature[]} searchResults
 * @property {Feature | undefined} [chosenResult]
 * @property {boolean} showResults
 */

/**
 * @typedef {(
 *   'handleClickaway' |
 *   'inputFocus' |
 *   'searchComplete' |
 *   'resultClick' |
 *   'inputChange')} ActionType
 */

/**
 * @type {React.Reducer<State, {type: ActionType, payload?: any}>}
 */
const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'handleClickaway': {
      return { ...state, showResults: false };
    }
    case 'inputFocus': {
      return { ...state, showResults: true };
    }
    case 'searchComplete': {
      return { ...state, showResults: true, searchResults: payload };
    }
    case 'resultClick': {
      return {
        ...state,
        showResults: false,
        chosenResult: payload,
        searchString: payload.place_name,
      };
    }
    case 'inputChange':
      return { ...state, searchString: payload };
    default:
      throw new Error();
  }
};

/**@type {State} */
const defaultState = {
  searchString: '',
  searchResults: [],
  showResults: false,
};

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

  /** @type {[State, React.Dispatch<{type: ActionType, payload?: any]} */
  const [state, dispatch] = useReducer(reducer, defaultState);
  const geocoderRef = useRef();

  const handleClickaway = event => {
    const path = event.path || (event.composedPath && event.composedPath());
    if (geocoderRef.current && !path.includes(geocoderRef.current))
      dispatch({ type: 'handleClickaway' });
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
        `${GEOCODE_API_URL}${state.searchString}.json?access_token=${mapboxApiAccessToken}`,
      );

      if (response.ok) {
        const results = await response.json();
        dispatch({ type: 'searchComplete', payload: results.features });
      }
    };
    if (
      state.searchString.length >= 3 &&
      state.searchString !== state.chosenResult?.place_name
    ) {
      search();
    }
  }, [mapboxApiAccessToken, state.chosenResult, state.searchString]);

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const handleInputChange = e => {
    dispatch({ type: 'inputChange', payload: e.target.value });
  };

  const handleResultClick = feature => () => {
    if (onSelect) onSelect(feature);
    dispatch({ type: 'resultClick', payload: feature });
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
          value={state.searchString}
          placeholder="type to search..."
          onChange={handleInputChange}
          onFocus={() => {
            if (state.searchResults.length) dispatch({ type: 'inputFocus' });
          }}
        />
      </div>
      {state.showResults && (
        <ul className={styles.resultsList}>
          {state.searchResults.map(feature => (
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
