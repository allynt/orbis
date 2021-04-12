import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  ButtonBase,
  Input,
  SearchIcon,
  Collapse,
  Link,
  makeStyles,
  Typography,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { difference, isEmpty } from 'lodash';

import { collectSourceIds } from 'data-layers/categorisation.utils';
import LayerSelectItem from './layer-select-item/layer-select-item.component';
import { Header } from '../components/header.component';
import { List } from '../components/list.component';
import { Section } from '../components/section.component';

const LayerSearch = ({ className, searchTerm = '', onChange, noResults }) => (
  <div className={className}>
    <Input
      startAdornment={<SearchIcon />}
      onChange={onChange}
      value={searchTerm}
      placeholder="Search for data layers"
      autoFocus
    />
    {noResults && <span>No results found for this keyword</span>}
  </div>
);

/**
 * @param {{
 *  sources: import('typings/orbis').CategorisedSources
 *  level: number
 *  onSourcesChange: (params: {
 *    source_ids: import('typings/orbis').Source['source_id'][]
 *    selected: boolean
 *  }) => void
 *  selectedSources: import('typings/orbis').Source['source_id'][]
 * }} params
 */
const renderCategories = ({
  sources,
  level,
  onSourcesChange,
  selectedSources,
}) =>
  sources.map(source =>
    source.category ? (
      <Accordion
        key={source.category}
        source={source}
        level={level}
        onSourcesChange={onSourcesChange}
        selectedSources={selectedSources}
      />
    ) : (
      <LayerSelectItem
        key={source.source_id}
        source={source}
        onChange={onSourcesChange}
        selected={selectedSources?.includes(source.source_id)}
      />
    ),
  );

const useAccordionStyles = makeStyles(theme => ({
  header: props => ({
    ...theme.typography.body1,
    width: '100%',
    padding: theme.spacing(1, 2),
    paddingLeft: theme.spacing(props.level + 1),
    marginBottom: props.level === 0 ? theme.spacing(1) : 0,
    display: 'flex',
    alignItems: 'center',
    backgroundColor:
      props.level === 0 ? theme.palette.secondary.main : 'transparent',
    color:
      props.level === 0
        ? theme.palette.getContrastText(theme.palette.secondary.main)
        : theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    justifyContent: 'flex-start',
    fontWeight: 600,
  }),
  selectAll: {
    marginLeft: 'auto',
    padding: 0,
    color: props =>
      props.level === 0
        ? theme.palette.getContrastText(theme.palette.secondary.main)
        : theme.palette.text.primary,
  },
  sourceCount: {
    fontWeight: 'normal',
    marginLeft: theme.spacing(1),
  },
  icon: {
    fontSize: 'inherit',
    marginRight: theme.spacing(1),
    transform: 'rotate(90deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.sharp,
    }),
    '&$open': {
      transform: 'rotate(180deg)',
    },
  },
  open: {},
}));

const Accordion = ({ source, level, onSourcesChange, selectedSources }) => {
  const styles = useAccordionStyles({ level });
  const [open, setOpen] = useState(false);
  const allSourceIds = useMemo(() => collectSourceIds(source.sources), [
    source,
  ]);
  const notYetSelected = useMemo(
    () => difference(allSourceIds, selectedSources),
    [allSourceIds, selectedSources],
  );
  const selectedCount = allSourceIds.length - notYetSelected.length;
  const allSelected = isEmpty(notYetSelected);

  /** @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} e */
  const handleSelectAllClick = e => {
    e.stopPropagation();
    if (allSelected)
      onSourcesChange({ source_ids: allSourceIds, selected: false });
    else onSourcesChange({ source_ids: notYetSelected, selected: true });
  };

  return (
    <React.Fragment key={source.category}>
      <ButtonBase className={styles.header} onClick={() => setOpen(c => !c)}>
        <TriangleIcon className={clsx(styles.icon, { [styles.open]: open })} />
        {source.category}
        <span className={styles.sourceCount}>
          ({selectedCount <= 0 ? '' : `${selectedCount}/`}
          {allSourceIds.length})
        </span>
        <Link
          variant="body2"
          component="button"
          className={styles.selectAll}
          onClick={handleSelectAllClick}
        >
          {allSelected ? 'unselect' : 'select'} all
        </Link>
      </ButtonBase>
      <Collapse
        unmountOnExit
        in={open}
        component={Box}
        pl={level + 1.65}
        mb={1}
      >
        {renderCategories({
          sources: source.sources,
          level: level + 1,
          onSourcesChange,
          selectedSources,
        })}
      </Collapse>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  noOrbMessage: {
    placeSelf: 'center',
    padding: theme.spacing(4),
    height: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: theme.spacing(2, 4),
  },
  layerSearch: {
    height: 'fit-content',
    padding: theme.spacing(2, 4),
  },
}));

/**
 * @param {{
 *   orbSources: import('typings/orbis').CategorisedSources
 *   searchTerm: string
 *   selectedSources?: import('typings/orbis').Source['source_id'][]
 *   hasMadeChanges?: boolean
 *   onSourcesChange: (params: {
 *     source_ids: import('typings/orbis').Source['source_id'][]
 *     selected: boolean}) => void
 *   onSearchChange: (params: { target: { value: any } }) => void
 *   onSubmit: () => void
 * }} props
 */
export const LayerSelect = ({
  orbSources,
  searchTerm,
  selectedSources,
  hasMadeChanges = false,
  onSourcesChange,
  onSearchChange,
  onSubmit,
}) => {
  const styles = useStyles();
  return (
    <Section orientation="right">
      <Header>Add Data Layers</Header>
      {orbSources ? (
        <div>
          <LayerSearch
            className={styles.layerSearch}
            searchTerm={searchTerm}
            onChange={onSearchChange}
            noResults={!orbSources?.length}
          />
          <List dense>
            {renderCategories({
              sources: orbSources,
              level: 0,
              onSourcesChange,
              selectedSources,
            })}
          </List>
        </div>
      ) : (
        <Typography className={styles.noOrbMessage}>
          Select Your Orb in order to find layers
        </Typography>
      )}
      <div className={styles.buttonContainer}>
        <Button disabled={!hasMadeChanges} onClick={onSubmit}>
          Confirm
        </Button>
      </div>
    </Section>
  );
};
