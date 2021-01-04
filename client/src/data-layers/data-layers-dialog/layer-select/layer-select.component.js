import React, { useMemo, useState } from 'react';

import { Box, Button, List, Typography } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { difference, isEmpty } from 'lodash';

import { collectSourceIds } from 'data-layers/categorisation.utils';
import { ReactComponent as ExpandIcon } from '../../triangle.svg';
import dialogStyles from '../data-layers-dialog.module.css';
import LayerSelectItem from './layer-select-item/layer-select-item.component';
import styles from './layer-select.module.css';

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
        className={styles.listItem}
        key={source.source_id}
        source={source}
        onChange={onSourcesChange}
        selected={selectedSources?.includes(source.source_id)}
      />
    ),
  );

const Accordion = ({ source, level, onSourcesChange, selectedSources }) => {
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
      <div
        className={clsx(styles.accordionHeader, {
          [styles.accordionHeaderRoot]: level === 0,
        })}
      >
        <button
          className={styles.accordionButton}
          onClick={() => setOpen(c => !c)}
        >
          <ExpandIcon className={clsx(styles.arrow, { [styles.open]: open })} />
          {source.category}{' '}
          <span className={styles.sourceCount}>({allSourceIds.length})</span>
        </button>
        <Button
          className={styles.selectAll}
          theme="link"
          onClick={handleSelectAllClick}
        >
          {allSelected ? 'unselect' : 'select'} all
        </Button>
      </div>
      <div
        className={clsx(styles.accordionContent, { [styles.open]: open })}
        style={{
          paddingLeft: `${0.5 * (level + 1)}rem`,
        }}
        aria-expanded={open}
      >
        {renderCategories({
          sources: source.sources,
          level: level + 1,
          onSourcesChange,
          selectedSources,
        })}
      </div>
    </React.Fragment>
  );
};

/**
 * @param {{
 *   orbSources: CategorisedSources
 *   selectedSources?: Source['source_id'][]
 *   hasMadeChanges?: boolean
 *   onSourcesChange: (params: {
 *     source_ids: Source['source_id'][]
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
        borderBottom="1px solid #e6e6e6"
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
        <Typography style={{ placeSelf: 'center' }}>
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
