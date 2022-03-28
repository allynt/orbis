import React, { useEffect, useState } from 'react';

import {
  CircularProgress,
  List,
  ListItem,
  TextField,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useDebounce } from 'hooks/useDebounce';
// import { useThrottle } from 'hooks/useThrottle';

const useStyles = makeStyles(theme => ({
  typeaheadGroup: {
    position: 'relative',
  },
  typeaheadListGroup: {
    position: 'absolute',
    width: '100%',
    top: '38px',
    left: '0',
    zIndex: '100',
  },
  typeaheadListGroupItem: {
    padding: '0.3rem 1.3rem',
    backgroundColor: '#fff',
    color: '#000',
    border: 'solid',
    '&:hover': {
      cursor: 'pointer',
      background: '#646464',
      color: '#fff',
    },
  },
}));

const Typeahead = ({ search }) => {
  const styles = useStyles();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [isNameSelected, setIsNameSelected] = useState(false);

  const searchFn = async value => {
    setResults(await search(value));
    setIsLoading(false);
  };

  const debouncedSearch = useDebounce(value => searchFn(value), 300);
  // const debouncedSearch = useThrottle((value: string) => searchFn(value), 5000);

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

  const onNameSelected = selectedName => {
    setName(selectedName);
    setIsNameSelected(true);
    setResults([]);
    console.log('Option Selected: ', selectedName);
  };

  return (
    <div className={styles.typeaheadGroup}>
      <TextField onChange={handleInputChange} value={name} autoFocus required />

      <List className={styles.typeaheadListGroup}>
        {!isNameSelected &&
          results.length > 0 &&
          results.map(result => (
            <ListItem
              key={result.name}
              className={styles.typeaheadListGroupItem}
              onClick={() => onNameSelected(result.name)}
            >
              {result.name}
            </ListItem>
          ))}
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
    </div>
  );
};

export default Typeahead;
