import * as React from 'react';

import {
  ListItem,
  ListItemText,
  makeStyles,
  Skeleton,
} from '@astrosat/astrosat-ui';

const useListItemClasses = makeStyles(theme => ({
  root: {
    opacity: 0.5,
    '&:hover:not(:disabled)': {
      backgroundColor: theme.palette.secondary.light,
    },
    '&$selected': {
      opacity: 1,
      backgroundColor: theme.palette.background.default,
      '&:hover:not(:disabled)': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
  },
  selected: {},
}));

const ResultsListItem = ({
  isLoading = false,
  result,
  selected = true,
  onClick,
  divider,
}) => {
  const listItemClasses = useListItemClasses();

  const handleClick = () => onClick && onClick(result);

  return (
    <ListItem
      disabled={isLoading}
      classes={listItemClasses}
      button
      onClick={handleClick}
      onKeyPress={handleClick}
      selected={selected}
      divider={divider}
    >
      <ListItemText
        primary={
          isLoading ? (
            <Skeleton role="progressbar" variant="text" width="20ch" />
          ) : (
            <span style={{ fontWeight: 600 }}>
              {result?.properties['Project ID'] || 'Unknown'}
            </span>
          )
        }
        secondary={
          isLoading ? (
            <Skeleton role="progressbar" variant="text" width="30ch" />
          ) : (
            <div>
              <div>Address: {result?.properties['Address'] || 'Unknown'}</div>
              <div>
                Development Type:{' '}
                {result?.properties['Development Type'] || 'Unknown'}
              </div>
            </div>
          )
        }
      />
    </ListItem>
  );
};

export default ResultsListItem;
