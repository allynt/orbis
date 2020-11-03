import { Button } from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React, { useState } from 'react';
import dialogStyles from '../data-layers-dialog.module.css';
import LayerSelectItem from './layer-select-item/layer-select-item.component';
import styles from './layer-select.module.css';
import { ReactComponent as ExpandIcon } from '../../triangle.svg';

/**
 * @param {OrbSources} sources
 * @param {number} level
 * @param {(params: {
 *     source_id: Source['source_id']
 *     selected: boolean}) => void} onSourceChange
 */
const renderCategories = (sources, level, onSourceChange) =>
  // @ts-ignore
  sources.map(source =>
    source.category ? (
      <Accordion
        source={source}
        level={level}
        onSourceChange={onSourceChange}
      />
    ) : (
      <LayerSelectItem
        className={styles.listItem}
        key={source.source_id}
        source={source}
        onChange={onSourceChange}
      />
    ),
  );

const Accordion = ({ source, level, onSourceChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment key={source.category}>
      <button
        className={clsx(styles.accordionHeader, {
          [styles.accordionHeaderRoot]: level === 0,
        })}
        onClick={() => setOpen(c => !c)}
      >
        <ExpandIcon className={clsx(styles.arrow, { [styles.open]: open })} />
        {source.category}
      </button>
      <div
        className={clsx(styles.accordionContent, { [styles.open]: open })}
        style={{
          paddingLeft: `${0.5 * (level + 1)}rem`,
        }}
        aria-expanded={open}
      >
        {renderCategories(source.sources, level + 1, onSourceChange)}
      </div>
    </React.Fragment>
  );
};

/**
 * @typedef {{
 *   category: string,
 *   sources: {category: string, sources: OrbSources}[] | Source[]
 * }[] | Source[]} OrbSources
 */

/**
 * @param {{
 *   orbSources: OrbSources
 *   selectedSources: Source['source_id'][]
 *   hasMadeChanges?: boolean
 *   onSourceChange: (params: {
 *     source_id: Source['source_id']
 *     selected: boolean}) => void
 *   onAcceptClick: () => void
 * }} props
 */
export const LayerSelect = ({
  orbSources,
  selectedSources,
  hasMadeChanges = false,
  onSourceChange,
  onAcceptClick,
}) => {
  return (
    <div className={styles.layerSelect}>
      <h1 className={dialogStyles.header}>Select Your Layers</h1>
      {orbSources ? (
        <ul className={styles.list}>
          {renderCategories(orbSources, 0, onSourceChange)}
        </ul>
      ) : (
        <p className={styles.noOrbMessage}>
          Select Your Orb in order to find layers
        </p>
      )}
      <Button className={styles.button} disabled={!hasMadeChanges}>
        Confirm
      </Button>
    </div>
  );
};
