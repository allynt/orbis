import React, { useEffect, useState } from 'react';

import {
  CircularProgress,
  List,
  ListItem,
  TextField,
  makeStyles,
  alpha,
} from '@astrosat/astrosat-ui';

import { useDebounce } from 'hooks/useDebounce';

import SidePanelListItem from '../../../mission-control/side-panel/side-panel-list-item.component';
import { zoomToArea } from '../aoi-utils';

const useStyles = makeStyles(theme => ({
  typeaheadGroup: {
    position: 'relative',
  },
  typeaheadListGroup: {
    position: 'absolute',
    width: '100%',
    top: '38px',
    left: '0',
    zIndex: '1000',
    paddingBottom: 'unset',
    boxShadow: `2px 4px 4px 4px ${alpha(theme.palette.grey[500], 0.5)}`,
    // maxHeight: '30%',
  },
  typeaheadListGroupItem: {
    padding: '0.3rem 1.3rem',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    borderBottom: `1px solid ${alpha(theme.palette.grey[500], 1)}`,
    minHeight: '5ch',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.action.active,
      color: theme.palette.secondary.main,
    },
  },
}));

const Typeahead = ({
  search,
  onSelectedSuggestionClick,
  viewport,
  viewState,
  setViewState,
}) => {
  const styles = useStyles();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [isNameSelected, setIsNameSelected] = useState(false);

  const searchFn = async value => {
    const result = await search(value);
    if (result?.suggestions.length > 0) {
      setResults(result);
    } else {
      if (result.geometry) {
        zoomToArea(viewport, viewState, setViewState, result);
      }
    }
    setIsLoading(false);
  };

  const debouncedSearch = useDebounce(value => searchFn(value), 1000);

  // It is possible that a search could still be in progress, when this
  // component unmounts. In this case, an error could occur, this useEffect
  // calls the debounced/throttled function's `cancel` function.
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleInputChange = async event => {
    const { value } = event.target;
    setName(value);

    // even if we've selected already an item from the list,
    // we should reset it since it's been changed.
    setIsNameSelected(false);

    // clean previous results, as would be the case if we get
    // the results from a server.
    setResults([]);

    if (value.length > 1) {
      setIsLoading(true);
    }

    debouncedSearch(value);
  };

  const onSuggestionSelected = suggestion => {
    setName(suggestion);
    setIsNameSelected(true);
    setResults([]);
    onSelectedSuggestionClick(suggestion);
  };

  return (
    <div className={styles.typeaheadGroup}>
      <TextField
        onChange={handleInputChange}
        value={name.title || ''}
        autoFocus
        placeholder="Search by name area, postcode, grid reference"
      />

      {results.suggestions?.length > 0 ? (
        <List className={styles.typeaheadListGroup}>
          {!isNameSelected &&
            results?.suggestions?.length > 1 &&
            results?.suggestions?.map(result => {
              let name = null;
              if (
                results.type === 'postcode-area' &&
                result.type === 'protected-area'
              ) {
                name = result.localAuthority
                  ? `${result.title} - ${result.localAuthority.name}`
                  : result.title;
              } else if (result.type === 'protected-area') {
                name = `${result.title} - ${result.code}`;
              } else if (result.type === 'place') {
                name = `${result.title} - ${result.localAuthority}`;
              } else if (
                results.type === 'postcode-area' &&
                result.type === 'grid_reference'
              ) {
                name = result.localAuthority
                  ? `${result.title} - ${result.localAuthority.name}`
                  : result.title;
              }

              return (
                <ListItem
                  key={name}
                  className={styles.typeaheadListGroupItem}
                  onClick={() => onSuggestionSelected(result)}
                  aria-label="listitem"
                >
                  {name}
                </ListItem>
              );
            })}
          {!results.length && isLoading && (
            <div className="typeahead-spinner-container">
              <CircularProgress
                data-testid="typeahead-spinner"
                color="inherit"
                size={20}
              />
            </div>
          )}
        </List>
      ) : null}
    </div>
  );
};

export default Typeahead;
