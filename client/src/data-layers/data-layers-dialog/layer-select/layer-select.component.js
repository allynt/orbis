import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  Link,
  List,
  makeStyles,
  Typography,
  TriangleIcon,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { difference, isEmpty } from 'lodash';

import { collectSourceIds } from 'data-layers/categorisation.utils';
import LayerSelectItem from './layer-select-item/layer-select-item.component';

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
        // className={styles.listItem}
        key={source.source_id}
        source={source}
        onChange={onSourcesChange}
        selected={selectedSources?.includes(source.source_id)}
      />
    ),
  );

const useAccordionStyles = makeStyles(theme => ({
  header: {
    width: '100%',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginBottom: props => (props.level === 0 ? theme.spacing(1) : 0),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: props =>
      props.level === 0 ? theme.palette.secondary.main : 'transparent',
    color: props =>
      props.level === 0
        ? theme.palette.getContrastText(theme.palette.secondary.main)
        : theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    justifyContent: 'flex-start',
    fontWeight: 600,
  },
  selectAll: {
    marginLeft: 'auto',
    padding: 0,
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
  const allSelected = isEmpty(notYetSelected);

  const handleSelectAllClick = () => {
    if (allSelected)
      onSourcesChange({ source_ids: allSourceIds, selected: false });
    else onSourcesChange({ source_ids: notYetSelected, selected: true });
  };

  return (
    <React.Fragment key={source.category}>
      <ButtonBase className={styles.header} onClick={() => setOpen(c => !c)}>
        <TriangleIcon className={clsx(styles.icon, { [styles.open]: open })} />
        {source.category}{' '}
        <span className={styles.sourceCount}>({allSourceIds.length})</span>
        <Link
          variant="body2"
          component="button"
          className={styles.selectAll}
          onClick={handleSelectAllClick}
        >
          {allSelected ? 'unselect' : 'select'} all
        </Link>
      </ButtonBase>
      <Collapse in={open}>
        <Box pl={level + 1} mb={1} aria-expanded={open}>
          {renderCategories({
            sources: source.sources,
            level: level + 1,
            onSourcesChange,
            selectedSources,
          })}
        </Box>
      </Collapse>
    </React.Fragment>
  );
};

/**
 * @param {{
 *   orbSources: import('typings/orbis').CategorisedSources
 *   selectedSources?: import('typings/orbis').Source['source_id'][]
 *   hasMadeChanges?: boolean
 *   onSourcesChange: (params: {
 *     source_ids: import('typings/orbis').Source['source_id'][]
 *     selected: boolean}) => void
 *   onSubmit: () => void
 * }} props
 */
export const LayerSelect = ({
  orbSources,
  selectedSources,
  hasMadeChanges = false,
  onSourcesChange,
  onSubmit,
}) => {
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateRows: 'max-content 1fr max-content',
        width: '60%',
        borderTopRightRadius: '1rem',
        borderBottomRightRadius: '1rem',
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        pt={3}
        pb={2}
        borderBottom={1}
        borderColor="grey.500"
        component={Typography}
        variant="h2"
      >
        Select Your Layers
      </Box>
      {orbSources ? (
        <List
          dense
          style={{
            padding: '1.375rem',
            overflowY: 'auto',
            height: '100%',
          }}
        >
          {renderCategories({
            sources: orbSources,
            level: 0,
            onSourcesChange,
            selectedSources,
          })}
        </List>
      ) : (
        <Typography
          style={{ placeSelf: 'center', padding: '1.375rem', height: '100%' }}
        >
          Select Your Orb in order to find layers
        </Typography>
      )}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        py={2}
        px={4}
      >
        <Button disabled={!hasMadeChanges} onClick={onSubmit}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};
