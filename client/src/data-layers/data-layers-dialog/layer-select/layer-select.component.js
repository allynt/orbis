import { Button } from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import dialogStyles from '../data-layers-dialog.module.css';
import LayerSelectItem from './layer-select-item/layer-select-item.component';
import styles from './layer-select.module.css';
import { ReactComponent as ExpandIcon } from '../../triangle.svg';
import { collectSourceIds } from 'data-layers/categorisation.utils';
import { difference, isEmpty } from 'lodash';

/**
 * @param {{
 *  sources: CategorisedSources
 *  level: number
 *  onSourcesChange: (params: {
 *    source_ids: Source['source_id'][]
 *    selected: boolean
 *  }) => void
 *  selectedSources: Source['source_id'][]
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
  const notYetSelected = difference(allSourceIds, selectedSources);
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
    <div className={styles.layerSelect}>
      <h1 className={dialogStyles.header}>Select Your Layers</h1>
      {orbSources ? (
        <ul className={dialogStyles.list}>
          {renderCategories({
            sources: orbSources,
            level: 0,
            onSourcesChange,
            selectedSources,
          })}
        </ul>
      ) : (
        <p className={styles.noOrbMessage}>
          Select Your Orb in order to find layers
        </p>
      )}
      <Button
        className={styles.button}
        disabled={!hasMadeChanges}
        onClick={onSubmit}
      >
        Confirm
      </Button>
    </div>
  );
};
