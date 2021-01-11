import * as React from 'react';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Skeleton,
} from '@astrosat/astrosat-ui';

import { Busy, NotBusy, VeryBusy } from '../icons';

/**
 * @param {CrowdlessFeatureProperties['crowdednessCategory']} crowdednessCategory
 */
const getIcon = crowdednessCategory => {
  switch (crowdednessCategory) {
    case 'not busy':
      return NotBusy;
    case 'busy':
      return Busy;
    case 'very busy':
      return VeryBusy;
    default:
      return () => null;
  }
};

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

/**
 * @param {{
 *   isLoading?: boolean
 *   result?: CrowdlessFeature
 *   selected?: boolean
 *   onClick?: (result: CrowdlessFeature) => void
 *   divider?: boolean
 * }} props
 */
const ResultsListItem = ({
  isLoading = false,
  result,
  selected = true,
  onClick,
  divider,
}) => {
  const listItemClasses = useListItemClasses();
  const Icon = getIcon(result?.properties?.crowdednessCategory);

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
      <ListItemIcon>
        {isLoading ? (
          <Skeleton
            role="progressbar"
            variant="circle"
            width="1.429em"
            height="1.429em"
          />
        ) : (
          <Icon title={result?.properties?.crowdednessCategory} />
        )}
      </ListItemIcon>
      <ListItemText
        primary={
          isLoading ? (
            <Skeleton role="progressbar" variant="text" width="20ch" />
          ) : (
            <span style={{ fontWeight: 600 }}>{result?.properties?.name}</span>
          )
        }
        secondary={
          isLoading ? (
            <Skeleton role="progressbar" variant="text" width="40ch" />
          ) : (
            result?.properties?.address
          )
        }
      />
    </ListItem>
  );
};

export default ResultsListItem;
